import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Utils from "../../QlikUtils";

function Table({ app, reference, onRowClick, className }) {
  const [data, setData] = useState({
    headerData: [],
    bodyData: [],
  });

  useEffect(() => {
    Utils.createHyperCubeByQlikId(app, reference.id, (tableData) => {
      const headerData = tableData.qHyperCube.qMeasureInfo;
      const bodyData = tableData.qHyperCube.qDataPages[0].qMatrix;
      setData({
        headerData,
        bodyData,
      });
    });
  }, []);

  function hasSubLevel(item) {
    return item.qText.indexOf("@level:") > -1;
  }

  return (
    <div className="tableWrapper">
      <table className={className}>
        <thead>
          <tr>
            <th>-</th>
            {data.headerData.map((item) => (
              <th key={Utils.generateId()}>{item.qFallbackTitle}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.bodyData.map((row) => {
            let color = "";
            let backgroundColor = "";

            if (row[0].qAttrExps && row[0].qAttrExps.qValues.length > 0) {
              color = row[0].qAttrExps.qValues[1].qText;
              if (color.indexOf("A") === 0) {
                color = Utils.convertARGBtoRGBA(color);
              }
              backgroundColor = row[0].qAttrExps.qValues[0].qText;
            }

            return (
              <tr
                key={Utils.generateId()}
                onClick={() => {
                  onRowClick(row);
                }}
                style={{ backgroundColor, color }}
              >
                {row.map((item) => {
                  const value = item.qText.split("|")[1];
                  let itemSplitted = [];
                  let paddingValue = 1;
                  if (hasSubLevel(item)) {
                    itemSplitted = item.qText.split("@level: ");
                    if (parseInt(itemSplitted[1][0], 10) === 0) {
                      paddingValue = 8;
                    } else {
                      paddingValue = itemSplitted[1][0] * 6;
                    }
                  }
                  return (
                    <td
                      key={Utils.generateId()}
                      style={{
                        backgroundColor,
                        paddingLeft: `${paddingValue}px`,
                      }}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

Table.defaultProps = {
  app: {},
  onRowClick: () => {},
  reference: {},
  className: "table",
};

Table.propTypes = {
  app: PropTypes.object,
  onRowClick: PropTypes.func,
  reference: PropTypes.object,
  className: PropTypes.string,
};

export default Table;
