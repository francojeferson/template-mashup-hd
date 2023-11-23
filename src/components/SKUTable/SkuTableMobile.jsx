import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import utils from "../../QlikUtils";
import { useSelections } from "../../context/Selections";
import FilterMessage from "../FilterMessage/FilterMessage";
import NativeFilter from "../NativeFilter/NativeFilter";
import ObjectError from "../ObjectError/ObjectError";
import ObjectLoader from "../ObjectLoader/ObjectLoader";
import TableElement from "./TableElement";

const SkuTableMobile = ({ app, config }) => {
  const refsToClose = useRef();
  const { body, filter } = config;
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const { selections } = useSelections();
  const [needSkus, setNeedSkus] = useState(true);
  const mounted = useRef();

  const headerData = async (app, id) => {
    const vis = await app.visualization.get(id);
    const { layout } = { ...vis.model };
    vis.close();

    return layout?.title || "";
  };

  const buildTable = async (rows, options) => {
    const { header } = options || {};
    if (header) {
      return Promise.all(
        rows[0].ids.map(async (id) => {
          const header = await headerData(app, id);
          return (
            <tr>
              <th>{header}</th>
            </tr>
          );
        }),
      );
    }

    return Promise.all(
      rows.map(async (row, rowsIndex, arr) => {
        const lastItem = rowsIndex === arr.length - 1;

        if (lastItem) {
          return (
            <tr>
              {await Promise.all(
                row.ids.map(async (id, index) => {
                  if (index === 0) {
                    const header = await headerData(app, id);
                    return <th>{header}</th>;
                  }
                  return (
                    <td style={{ paddingRight: "10px" }}>
                      <NativeFilter
                        app={app}
                        reference={{ id }}
                        style={{
                          height: "35px",
                          minWidth: "100px",
                        }}
                      />
                    </td>
                  );
                }),
              )}
            </tr>
          );
        }

        return (
          <tr>
            {await Promise.all(
              row.ids.map(async (id, index) => {
                if (index === 0) {
                  const header = await headerData(app, id);
                  return <th>{header}</th>;
                }
                return (
                  <TableElement
                    key={id}
                    app={app}
                    reference={{
                      id,
                      format: rowsIndex !== 0 ? "0.00 a" : null,
                    }}
                  />
                );
              }),
            )}
          </tr>
        );
      }),
    );
  };

  useEffect(() => {
    mounted.current = true;
    if (app) {
      utils.createHyperCubeByQlikId(app, body[0].ids[1], async (res, vis) => {
        refsToClose.current = { hypercube: res, vis };
        if (res?.code) {
          setError({
            message: "Could not load object",
          });
          setIsLoaded(true);
        }

        if (Object.keys(data).length > 0) setData({});

        const bodyData = await buildTable(body);
        setData({ bodyData });
        setIsLoaded(true);
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

  if (!isLoaded)
    return <ObjectLoader type="table" width="inherit" height="inherit" />;

  return error ? (
    <ObjectError message={error.message} />
  ) : (
    <div className="tableMasterWrapper">
      {needSkus ? (
        <FilterMessage message={filter.message} />
      ) : (
        <table className="tableMaster mobile">
          <tbody>{data.bodyData}</tbody>
        </table>
      )}
    </div>
  );
};

SkuTableMobile.defaultProps = {
  app: null,
  config: {},
};

SkuTableMobile.propTypes = {
  app: PropTypes.object,
  config: PropTypes.object,
};

export default SkuTableMobile;
