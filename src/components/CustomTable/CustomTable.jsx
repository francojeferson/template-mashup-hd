import { debounce, throttle } from "lodash";
import PropTypes from "prop-types";
import { createRef, useEffect, useState } from "react";
import Utils from "../../QlikUtils";
import ObjectLoader from "../ObjectLoader/ObjectLoader";

function CustomTable({ app, reference, className }) {
  const [searchOpened, setSearchOpened] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [eventAdded, setEventAdded] = useState(false);
  const tableRef = createRef();
  const [choseColumnOpened, setChoseColumnOpened] = useState(false);
  const [hideColumn, setHideColumn] = useState(false);
  const [data, setData] = useState({
    headerData: [],
    bodyData: [],
    visualizationModel: null,
    firstField: false,
  });

  const toggleSearch = () => {
    setSearchOpened(!searchOpened);
  };

  const searchFunction = debounce((evt) => {
    setSearchWord(evt.target.value);
  }, 1000);

  useEffect(() => {
    if (!hideColumn) return;
    if (!reference.radioButtonControl || !reference.columnToHideRadioButton)
      return;
    const column = reference.columnToHideRadioButton - 1;
    if (hideColumn.indexOf(column) > -1) {
      reference.radioButtonControl(true);
    }
    if (hideColumn.indexOf(column) === -1) {
      reference.radioButtonControl(false);
    }
  }, [hideColumn]);

  const changeTableColumn = (i) => {
    const newArr = [];
    data.headerData.forEach((item, j) => {
      if (j === 0 || j === i) return;
      newArr.push(j);
    });
    setHideColumn(newArr);
    setChoseColumnOpened(false);
  };

  useEffect(() => {
    if (
      !reference.maxColumnsToShow ||
      data.headerData.length === 0 ||
      hideColumn
    )
      return;
    const cancelArray = [];
    data.headerData.forEach((item, i) => {
      if (reference.maxColumnsToShow <= i) {
        cancelArray.push(i);
      }
    });
    setHideColumn(cancelArray);
  }, [data]);

  useEffect(() => {
    const field = data.firstField;
    if (data.visualizationModel && field && searchWord) {
      //  eslint-disable-next-line prefer-template
      const arg = `=if(wildmatch([${field}], '${
        searchWord + "*"
      }') > 0, [${field}])`;
      const softPatches = {
        //  eslint-disable-next-line quote-props, quotes
        qPath: "/qHyperCubeDef/qDimensions/0",
        //  eslint-disable-next-line quote-props, quotes
        qOp: "replace",
        //  eslint-disable-next-line quote-props, quotes, prefer-template
        qValue: '{ "qDef" : {"qFieldDefs" : ["' + arg + '"]  } } ',
      };
      data.visualizationModel.model.enigmaModel.applyPatches(
        [softPatches],
        true,
      );
    } else if (data.visualizationModel && field && !searchWord) {
      //  eslint-disable-next-line prefer-template
      const arg = field;
      const softPatches = {
        //  eslint-disable-next-line quote-props, quotes
        qPath: "/qHyperCubeDef/qDimensions/0",
        //  eslint-disable-next-line quote-props, quotes
        qOp: "replace",
        //  eslint-disable-next-line quote-props, quotes, prefer-template
        qValue: '{ "qDef" : {"qFieldDefs" : ["' + arg + '"]  } } ',
      };
      data.visualizationModel.model.enigmaModel.applyPatches(
        [softPatches],
        true,
      );
    }
  }, [searchWord]);

  useEffect(() => {
    // pode ser passado a quantidade de dados que ele carrega pelo reference
    const th = reference.height || 40;
    Utils.createHyperCubeByQlikIdToTable(
      app,
      reference.id,
      th,
      (tableData, vis, title, id) => {
        app.visualization.get(id).then((visualizationModel) => {
          const order = visualizationModel.model.layout.qHyperCube.qColumnOrder;
          const firstArr = [
            ...tableData.qHyperCube.qDimensionInfo,
            ...tableData.qHyperCube.qMeasureInfo,
          ];
          const headerData = [];
          //  ordenando o array de acordo com a ordenaçao original da tabela
          firstArr.forEach((item, i) => {
            headerData.push(firstArr[order[i]]);
          });
          const field =
            vis.model.layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0];
          const bodyData = tableData.qHyperCube.qDataPages[0].qMatrix;
          setData({
            headerData,
            bodyData,
            visualizationModel,
            firstField: field.indexOf("=") > -1 ? field.split("=")[1] : field,
          });
        });
      },
    );
  }, []);

  useEffect(() => {
    if (!tableRef.current || !data.visualizationModel || eventAdded) return;
    setEventAdded(true);
    tableRef.current.addEventListener(
      "scroll",
      throttle((evt) => {
        const table = evt.target;
        const difTableHeight =
          table.scrollHeight - table.scrollTop - table.offsetHeight;
        if (difTableHeight < 100) {
          data.visualizationModel.model.getProperties().then((res) => {
            res.qHyperCubeDef.qInitialDataFetch[0].qHeight +=
              reference.loadMore || 20;
            data.visualizationModel.model.setProperties(res);
          });
        }
      }, 1000),
    );
  }, [tableRef, data]);

  return (
    <div
      ref={tableRef}
      style={{ maxHeight: "700px" }}
      className={searchOpened ? "tableWrapper active-search" : "tableWrapper"}
    >
      {searchOpened && (
        <div className="custom-table-search-header">
          <div className="custom-table-search-top-header">
            <div>
              <button type="button" onClick={toggleSearch}>
                <i className="far fa-arrow-left" />
              </button>
            </div>
            <div>
              <span>Pesquisar Produto</span>
            </div>
          </div>
          <div>
            <div>
              <i className="far fa-search" />
            </div>
            <div>
              <input
                defaultValue={searchWord}
                type="text"
                placeholder="Pesquise por descrição"
                onChange={searchFunction}
              />
            </div>
          </div>
        </div>
      )}
      <table className={className}>
        <thead>
          <tr>
            {data.headerData.map((item, i) => {
              if (
                reference.maxColumnsToShow &&
                hideColumn &&
                hideColumn.indexOf(i) > -1
              )
                return;

              return (
                <th
                  className={i === 0 ? "align-left" : "align-right"}
                  key={Utils.generateId()}
                >
                  {i === 0 && !searchOpened && (
                    <button
                      className="custom-table-search-button"
                      type="button"
                      onClick={toggleSearch}
                    >
                      <i className="far fa-search" />
                      {item.qFallbackTitle}
                    </button>
                  )}
                  {i === 0 && searchOpened && <div>{item.qFallbackTitle}</div>}
                  {i > 0 && !reference.maxColumnsToShow && item.qFallbackTitle}
                  {i > 0 && reference.maxColumnsToShow && (
                    <button
                      className="table-header-btn"
                      onClick={() => {
                        setChoseColumnOpened(true);
                      }}
                      type="button"
                    >
                      <span>{item.qFallbackTitle}</span>
                      <i className="far fa-chevron-down" />
                    </button>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.bodyData.map((row) => {
            let color = "";
            let backgroundColor = "";

            if (row[0].qAttrExps && row[0].qAttrExps.qValues.length > 0) {
              color = row[0].qAttrExps.qValues[1].qText;
              if (color && color.indexOf("A") === 0) {
                color = Utils.convertARGBtoRGBA(color);
              }
              backgroundColor = row[0].qAttrExps.qValues[0].qText;
            }
            return (
              <tr key={Utils.generateId()} style={{ backgroundColor, color }}>
                {row.map((item, i) => {
                  const value = item.qText;

                  if (
                    reference.maxColumnsToShow &&
                    hideColumn &&
                    hideColumn.indexOf(i) > -1
                  )
                    return;
                  return (
                    <td
                      className={i === 0 ? "align-left" : "align-right"}
                      key={Utils.generateId()}
                      style={{ backgroundColor }}
                    >
                      <div className="custom-table-cell">
                        {reference.columnIcon &&
                          i === 0 &&
                          row[reference.columnIcon - 1].qText !==
                            "ZZ_Sem Oferta" && <i className="fas fa-tag" />}
                        <span>{value}</span>
                        {reference.hideLastColumns && i > 0 && (
                          <i className="fal fa-plus-circle neutral-color" />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {reference.maxColumnsToShow && (
        <div
          className={
            choseColumnOpened
              ? "table-chose-column active"
              : "table-chose-column"
          }
        >
          <div className="custom-table-top-change-column">
            <button
              type="button"
              onClick={() => {
                setChoseColumnOpened(false);
              }}
            >
              <i className="far fa-arrow-left" />
            </button>
            <span>Mostrar na coluna preço</span>
          </div>
          <div className="custom-table-column-list">
            {data.headerData.map((item, i) => {
              if (i === 0) return;

              if (
                reference.hideLastColumns &&
                data.headerData.length - reference.hideLastColumns - 1 < i
              )
                return;
              return (
                <div>
                  <button
                    className={
                      hideColumn && hideColumn.indexOf(i) > -1
                        ? "table-column-control"
                        : "table-column-control active"
                    }
                    type="button"
                    onClick={() => {
                      changeTableColumn(i);
                    }}
                  >
                    <div className="table-radio-btn" />
                    {item.qFallbackTitle}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {data.bodyData.length === 0 && (
        <div className="custom-table-loader-container">
          <ObjectLoader icon="table" />
        </div>
      )}
      {data.visualizationModel &&
        data.visualizationModel.model.layout.qHyperCube.qSize.qcy >
          data.bodyData.length && (
          <div className="custom-table-load-more-data">
            <ObjectLoader icon="circle" />
            <span>Carregando mais produtos</span>
          </div>
        )}
    </div>
  );
}

CustomTable.defaultProps = {
  app: {},
  reference: {
    height: 40,
    loadMore: 20,
  },
  className: "table",
};

CustomTable.propTypes = {
  app: PropTypes.object,
  reference: PropTypes.object,
  className: PropTypes.string,
};

export default CustomTable;
