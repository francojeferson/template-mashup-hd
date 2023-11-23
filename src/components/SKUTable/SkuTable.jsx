import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import utils from "../../QlikUtils";
import { useSelections } from "../../context/Selections";
import FilterMessage from "../FilterMessage/FilterMessage";
import NativeFilter from "../NativeFilter/NativeFilter";
import ObjectError from "../ObjectError/ObjectError";
import ObjectLoader from "../ObjectLoader/ObjectLoader";
import TableElement from "./TableElement";

const SkuTable = ({ app, config }) => {
  const refsToClose = useRef();
  const { header, body, filter } = config;
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const mounted = useRef();
  const { selections } = useSelections();
  const [needSkus, setNeedSkus] = useState(true);

  const headerData = async (app, id) => {
    if (!id) return "";
    const vis = await app.visualization.get(id);
    const { layout } = { ...vis.model };

    vis.close();

    const text = layout?.title || "";

    return text;
  };

  const buildTable = async (rows, options) => {
    const { header } = options || {};

    if (header) {
      return Promise.all(
        rows[0].ids.map(async (id) => {
          const header = await headerData(app, id);
          return <th key={`skuTableDesktop-${id}`}>{header}</th>;
        }),
      );
    }

    return Promise.all(
      rows.map(async (row) => (
        <tr>
          {await Promise.all(
            row.ids.map(async (id, index, r) => {
              if (index === r.length - 1) {
                return (
                  <td key={`tableTd-${id}`} style={{ paddingRight: "10px" }}>
                    <NativeFilter
                      key={`nativeSkuTable-${id}`}
                      app={app}
                      reference={{ id }}
                      style={{ height: "35px" }}
                    />
                  </td>
                );
              }
              return (
                <TableElement
                  key={`tableSKU-${id}`}
                  app={app}
                  reference={{
                    id,
                    format: index !== 0 ? "0.00 a" : null,
                  }}
                />
              );
            }),
          )}
        </tr>
      )),
    );
  };

  useEffect(() => {
    if (mounted.current) {
      const skus =
        selections.filter(
          (selection) => selection.qField === filter.field,
        )[0] || [];
      if (skus?.qSelectedCount > 0) {
        setNeedSkus(false);
      }
    }

    return () => {
      setNeedSkus(true);
    };
  }, [selections]);

  useEffect(() => {
    if (app) {
      mounted.current = true;
      utils.createHyperCubeByQlikId(app, body[0].ids[0], async (res, vis) => {
        if (mounted.current) {
          refsToClose.current = { hypercube: res, vis };
          if (res?.code) {
            setError({
              message: "Could not load object",
            });
            setIsLoaded(true);
          }

          if (Object.keys(data).length > 0) setData({});

          const headerData = await buildTable(header, {
            header: true,
          });
          const bodyData = await buildTable(body);

          setData({ headerData, bodyData });
          setIsLoaded(true);
        }
      });
    }

    return () => {
      mounted.current = false;
      if (refsToClose.current) {
        utils.destroyHC(
          app,
          refsToClose.current?.hypercube,
          refsToClose.current?.vis,
        );
      }
    };
  }, [app]);

  if (!isLoaded)
    return <ObjectLoader type="table" width="inherit" height="inherit" />;

  return error ? (
    <ObjectError message={error.message} />
  ) : (
    <div className="tableMasterWrapper">
      {needSkus ? (
        <FilterMessage message={filter.message} />
      ) : (
        <table className="tableMaster">
          <thead>
            <tr>{data.headerData}</tr>
          </thead>
          <tbody>{data.bodyData}</tbody>
        </table>
      )}
    </div>
  );
};

SkuTable.defaultProps = {
  app: null,
  config: {},
};

SkuTable.propTypes = {
  app: PropTypes.object,
  config: PropTypes.object,
};

export default SkuTable;
