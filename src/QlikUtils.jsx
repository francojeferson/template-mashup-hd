import { merge } from "lodash";
import numeral from "numeral";
import { v4 as uuidv4 } from "uuid";

const utils = {
  generateId: () => `id_${uuidv4()}`,
  destroyHC: (app, hc, model) => {
    try {
      app.destroySessionObject(hc.qInfo.qId);
      if (model) model.close();
    } catch (err) {
      console.error(err);
    }
  },
  convertARGBtoRGBA(argbString) {
    const colorString = argbString.substring(5, argbString.length - 1);
    const colorArray = colorString.split(",");
    let a = colorArray[0];
    if (a < 255) {
      a = (a / 255).toFixed(2);
    }
    const r = colorArray[1];
    const g = colorArray[2];
    const b = colorArray[3];
    return `rgba(${r},${g},${b},${a})`;
  },
  isLight: (color) => {
    const hex = color.replace("#", "");
    const cR = parseInt(hex.substr(0, 2), 16);
    const cG = parseInt(hex.substr(2, 2), 16);
    const cB = parseInt(hex.substr(4, 2), 16);
    const brightness = (cB * 299 + cG * 587 + cR * 114) / 1000;
    return brightness > 200;
  },
  evaluateExpression: (app, expression) =>
    new Promise((resolve) => {
      if (!expression) resolve("");
      if (expression.indexOf("=") !== 0) resolve(expression);
      app.model.evaluateExpression(expression).then((data) => {
        resolve(data);
      });
    }),
  onDataChanged: (app, callback) => {
    let fromCreation = true;
    app.createCube({ qMeasures: [{ qDef: { qDef: "=1+1" } }] }, () => {
      if (fromCreation === true) {
        fromCreation = false;
      } else {
        callback();
      }
    });
  },
  getCube: (app, cube, callback) => {
    if (app) {
      app.createCube(cube[0], (reply) => {
        console.log("reply", reply);
        callback({
          data: reply.qHyperCube,
          id: reply,
        });
      });
    }
  },
  testGeneric: (app, callback) => {
    console.log("app ->", app.genericObject.getLayout());
    callback(app);
  },
  createHyperCubeByQlikIdPivotable: (app, qlikId, type, callback) => {
    app.visualization.get(qlikId).then(
      (visualizationModel) => {
        visualizationModel.model.getProperties().then((res) => {
          const data = res;
          console.log("Data ->", data);
          const { title } = data;

          data.qHyperCubeDef.qAlwaysFullyExpanded = true;

          if (
            data.qHyperCubeDef.qInitialDataFetch &&
            data.qHyperCubeDef.qInitialDataFetch[0]
          ) {
            const columnsNum = data.qHyperCubeDef.qInterColumnSortOrder.length;
            data.qHyperCubeDef.qInitialDataFetch[0].qWidth = columnsNum;
            data.qHyperCubeDef.qInitialDataFetch[0].qHeight = Math.floor(
              10000 / columnsNum,
            );
          } else {
            const columnsNum = data.qHyperCubeDef.qInterColumnSortOrder.length;
            data.qHyperCubeDef.qInitialDataFetch = [
              {
                qHeight: Math.floor(10000 / columnsNum),
                qWidth: columnsNum,
              },
            ];
          }

          data.qHyperCubeDef.qShowTotalsAbove = true;

          function getTitle(hcData) {
            console.log("getTitle");
            if (title.indexOf("=") === 0) {
              app.model.evaluateExpression(title).then(() => {
                // console.log("callback - get- title -> ", hcData);
                // callback(hcData, visualizationModel);
              });
            } else {
              // console.log("callback - get- title -> ", visualizationModel);
              callback(visualizationModel);
            }
          }

          app.createCube(data.qHyperCubeDef, getTitle);
        });
      },
      (err) => {
        callback(err);
      },
    );
  },
  extractPivotDataSet(hypercube) {
    return new Promise((resolve) => {
      const dataPages = hypercube.qPivotDataPages;
      const dimensionInfo = hypercube.qDimensionInfo;
      const measureInfo = hypercube.qMeasureInfo;

      // let dataset = [[]];
      const lista = [];
      const listaData = [];
      if (dataPages && dataPages.length > 0) {
        dimensionInfo.forEach((dimension) => {
          // dataset[0].push(dimension.qFallbackTitle);
        });
        measureInfo.forEach((measure) => {
          // dataset[0].push(measure.qFallbackTitle);
        });

        if (measureInfo.length > 0) {
          dataPages[0].qLeft.forEach((item) => {
            // console.log("value ", item);
            item.qSubNodes.forEach((itemSub) => {
              // console.log("Ano:"+item.qValue +"Mes:"+itemSub.qValue);
              lista.push({
                Ano: item.qValue,
                Mes: itemSub.qValue,
              });
            });
          });
          dataPages[0].qData.forEach((item, index) => {
            for (let i = 0; i < measureInfo.length; i += 1) {
              const measureTitle = measureInfo[i].qFallbackTitle;
              const value = item[i].qNum;

              const node = lista[index];
              listaData.push({
                medida: measureTitle,
                valor: value,
                ...node,
              });
            }
          });
        }
      }

      // if (hypercube.qHyperCube.qStackedDataPages.length > 0) {
      //     dataset[0].push(dimensionInfo[0].qFallbackTitle);

      //     const subnodes = hypercube.qHyperCube.qStackedDataPages[0].qData[0].qSubNodes;

      //     subnodes[0].qSubNodes.forEach((serie) => {
      //         dataset[0].push(serie.qText);
      //     });

      //     const structuredDataSet = subnodes.map((item) => [
      //         item.qText,
      //         ...item.qSubNodes.map(
      //             (firstLevel) => firstLevel.qSubNodes.map(
      //                 (secondLevel) => secondLevel.qValue || undefined
      //             )[0]
      //         )
      //     ]);

      //     dataset = [...dataset, ...structuredDataSet];
      // }
      console.log(lista);
      console.log(listaData);
      resolve({
        resultado: listaData,
      });
    });
  },
  extractDataSet(hypercube) {
    const dataPages = hypercube.qHyperCube.qDataPages;
    const dimensionInfo = hypercube.qHyperCube.qDimensionInfo;
    const measureInfo = hypercube.qHyperCube.qMeasureInfo;
    let dataset = [[]];
    if (dataPages && dataPages.length > 0) {
      dimensionInfo.forEach((dimension) => {
        dataset[0].push(dimension.qFallbackTitle);
      });
      measureInfo.forEach((measure) => {
        dataset[0].push(measure.qFallbackTitle);
      });
      if (dimensionInfo.length) {
        dataPages[0].qMatrix.forEach((item) => {
          for (let i = 0; i < dimensionInfo.length; i += 1) {
            dataset.push([item[i].qText]);
          }
        });
        dataPages[0].qMatrix.forEach((item, index) => {
          const infoLength = dimensionInfo.length + measureInfo.length;
          for (let i = dimensionInfo.length; i < infoLength; i += 1) {
            if (dataset[index + 1]) {
              dataset[index + 1].push(item[i].qNum);
            }
          }
        });
      } else {
        dataPages[0].qMatrix.forEach((item) => {
          for (let i = 0; i < measureInfo.length; i += 1) {
            const measureTitle = measureInfo[i].qFallbackTitle;
            const value = item[i].qText;
            dataset.push([measureTitle, value]);
          }
        });
      }
    }

    if (hypercube.qHyperCube.qStackedDataPages.length > 0) {
      dataset[0].push(dimensionInfo[0].qFallbackTitle);

      const subnodes =
        hypercube.qHyperCube.qStackedDataPages[0].qData[0].qSubNodes;

      subnodes[0].qSubNodes.forEach((serie) => {
        dataset[0].push(serie.qText);
      });

      const structuredDataSet = subnodes.map((item) => [
        item.qText,
        ...item.qSubNodes.map(
          (firstLevel) =>
            firstLevel.qSubNodes.map(
              (secondLevel) => secondLevel.qValue || undefined,
            )[0],
        ),
      ]);

      dataset = [...dataset, ...structuredDataSet];
    }
    return dataset;
  },
  extractData(hc, type, format, horizontal) {
    return new Promise((resolve) => {
      const series = [];
      const hypercube = hc.qHyperCube;
      let labels = [];
      if (hypercube.qError) {
        resolve({
          series: [],
          labels: [],
          errorMessage: hypercube.qError,
        });
      }

      // console.log(hypercube);

      hypercube.qMeasureInfo.map((measure, index) => {
        const { qMin, qMax, qAttrExprInfo } = measure;
        const item = {
          name: measure.qFallbackTitle,
          data: hypercube.qDataPages[0].qMatrix.map((innerItem) => {
            const serieItem =
              innerItem[hypercube.qDimensionInfo.length + index];

            // console.log(measure.coloring.baseColor.color);
            let finalColor = measure.coloring.baseColor.color;
            const value = serieItem.qNum;

            if (serieItem.qAttrExps) {
              if (serieItem.qAttrExps.qValues[0]?.qText) {
                finalColor = serieItem.qAttrExps.qValues[0]?.qText;
              } else {
                const { qFallbackTitle: colorExpression } = qAttrExprInfo[0];
                if (colorExpression) {
                  const [, color1, color2] = colorExpression?.split(",") || [
                    "",
                    "#38BC9A",
                    "#E95248)",
                  ];
                  finalColor = value > 0 ? color1 : color2?.split(")")[0];
                }
              }
            }

            return {
              formattedValue: format
                ? numeral(value).format(format)
                : serieItem.qText,
              value: value,
              label: {
                position: horizontal
                  ? this.getLabelPosition(value, {
                      qMin,
                      qMax,
                    })
                  : "top",
                color: horizontal
                  ? this.getLabelColor(value, { qMin, qMax })
                  : "#666666",
              },
              itemStyle: {
                color: finalColor,
                width: "25px",
              },
            };
          }),

          label: {
            formatter: (value) => value.formattedValue,
          },
          min: qMin,
          max: qMax,
          type: type,
        };
        if (measure.series) {
          item.yAxisIndex = measure.series.axis;
        }
        series.push(item);
        return item;
      });
      labels = hypercube.qDataPages[0].qMatrix.map((item) => item[0].qText);

      resolve({
        series: series,
        labels: labels,
      });
    });
  },
  createHyperCubeByQlikId: (app, qlikId, callback, type) => {
    app.visualization.get(qlikId).then(
      (visualizationModel) => {
        visualizationModel.model.getProperties().then((res) => {
          const data = res;
          const stringTitle = data.title.qStringExpression;
          const title = stringTitle ? stringTitle.qExpr : data.title;
          if (type === "stacked") {
            data.qHyperCubeDef.qMode = "K";
          }
          if (
            data.qHyperCubeDef.qInitialDataFetch &&
            data.qHyperCubeDef.qInitialDataFetch[0]
          ) {
            const columnsNum = data.qHyperCubeDef.qInterColumnSortOrder.length;
            data.qHyperCubeDef.qInitialDataFetch[0].qWidth = columnsNum;
            data.qHyperCubeDef.qInitialDataFetch[0].qHeight = Math.floor(
              10000 / columnsNum,
            );
          } else {
            const columnsNum = data.qHyperCubeDef.qInterColumnSortOrder.length;
            data.qHyperCubeDef.qInitialDataFetch = [
              {
                qHeight: Math.floor(10000 / columnsNum),
                qWidth: columnsNum,
              },
            ];
          }

          data.qHyperCubeDef.qShowTotalsAbove = true;
          function getTitle(hcData) {
            if (title.indexOf("=") === 0) {
              app.model.evaluateExpression(title).then(() => {
                callback(hcData, visualizationModel);
              });
            } else {
              callback(hcData, visualizationModel, title);
            }
          }
          app.createCube(data.qHyperCubeDef, getTitle);
        });
      },
      (err) => {
        callback(err);
      },
    );
  },
  createHyperCubeByQlikIdToTable: (app, qlikId, tableHeight, callback) => {
    app.visualization.get(qlikId).then(
      (visualizationModel) => {
        visualizationModel.model.getProperties().then((res) => {
          const data = res;
          const stringTitle = data.title.qStringExpression;
          const title = stringTitle ? stringTitle.qExpr : data.title;
          if (
            data.qHyperCubeDef.qInitialDataFetch &&
            data.qHyperCubeDef.qInitialDataFetch[0]
          ) {
            const columnsNum = data.qHyperCubeDef.qInterColumnSortOrder.length;
            data.qHyperCubeDef.qInitialDataFetch[0].qWidth = columnsNum;
            data.qHyperCubeDef.qInitialDataFetch[0].qHeight = tableHeight;
          } else {
            const columnsNum = data.qHyperCubeDef.qInterColumnSortOrder.length;
            data.qHyperCubeDef.qInitialDataFetch = [
              {
                qHeight: tableHeight,
                qWidth: columnsNum,
              },
            ];
          }

          data.qHyperCubeDef.qShowTotalsAbove = true;
          function geTitle(hcData) {
            if (title.indexOf("=") === 0) {
              app.model.evaluateExpression(title).then(() => {
                callback(hcData, visualizationModel, "", hcData.qInfo.qId);
              });
            } else {
              callback(hcData, visualizationModel, title, hcData.qInfo.qId);
            }
          }
          app.createCube(data.qHyperCubeDef, geTitle);
        });
      },
      (err) => {
        callback(err);
      },
    );
  },
  getHyperCube: (dimensions, measures, options) => {
    const definition = {
      qStateName: "",
      qReductionMode: "N",
      qPopulateMissing: true,
      qDimensions: dimensions.map((dimension) => ({
        qDef: { qFieldDefs: [dimension] },
      })),
      qMeasures: measures.map((measure) => ({
        qDef: {
          qDef: measure.definition,
          qNumFormat: {
            // FORMATS
            /*
                          U or UNKNOWN
                          A or ASCII
                          I or INTEGER
                          R or REAL
                          F or FIX
                          M or MONEY
                          D or DATE
                          T or TIME
                          TS or TIMESTAMP
                          IV or INTERVAL */
            qType:
              measure.format && measure.format.type ? measure.format.type : "R",
            qFmt:
              measure.format && measure.format.expression
                ? measure.format.expression
                : "##.#",
          },
          qLabel: measure.label,
        },
      })),
      qInterColumnSortOrder: [0, 1],
      qMode: "S",
      qInitialDataFetch: [
        {
          qHeight: 500,
          qLeft: 0,
          qTop: 0,
          qWidth: 10,
        },
      ],
      customErrorMessage: {
        calcCond: "",
      },
    };

    return merge(definition, options);
  },
  fullTime: (dateParam) => {
    if (!dateParam) return;
    const date = new Date(dateParam);
    let finalDate = null;
    const year = date.getFullYear();
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const hours =
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    finalDate = `${day}/${month}/${year} - ${hours}:${minutes}`;
    return finalDate;
  },
  getDate: (dateParam) => {
    if (!dateParam) return;
    const date = new Date(dateParam);
    let finalDate = null;
    const year = date.getFullYear();
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    finalDate = `${day}/${month}/${year}`;
    return finalDate;
  },
  getDataFromList(app, field, query) {
    return new Promise((resolve) => {
      app
        .createList({
          qDef: {
            qFieldDefs: [`=if(wildmatch(${field}, '${query}') > 0, ${field})`],
          },
          qInitialDataFetch: [
            {
              qTop: 0,
              qLeft: 0,
              qHeight: 5,
              qWidth: 1,
            },
          ],
        })
        .then((model) => {
          const columns = model.layout.qListObject.qSize.qcx;
          const totalheight = model.layout.qListObject.qSize.qcy;
          const pageheight = Math.floor(5 / columns);
          const numberOfPages = Math.ceil(totalheight / pageheight);
          // return early
          if (model.layout.qListObject.qDataPages.length === 0) {
            return;
          }
          // has data
          let allData = model.layout.qListObject.qDataPages[0].qMatrix.map(
            (item) => item[0].qText,
          );
          if (numberOfPages === 1) {
            resolve(allData);
          } else {
            // eslint-disable-next-line prefer-spread
            const promises = Array.apply(null, Array(numberOfPages)).map(
              (data, index) => {
                const page = {
                  qTop: 5 * index + index,
                  qLeft: 0,
                  qWidth: columns,
                  qHeight: 5,
                  index: index,
                };
                return model.getListObjectData("/qListObjectDef", [page]);
              },
              this,
            );
            Promise.all(promises).then((data) => {
              // eslint-disable-next-line no-plusplus
              for (let j = 0; j < data.length; j++) {
                allData = allData.concat(
                  data[j][0].qMatrix.map((item) => item[0].qText),
                );
              }
              resolve(allData);
            });
          }
        });
    });
  },
  generateDataZoomMedias: (data, options) => {
    const showScrollBar = options?.showScrollBar || false;
    const zoom = options?.zoom || 40;
    const displayZoom = data.length > 6;
    const getSize = () => {
      const { width } = window.screen;
      if (width > 980 && width < 1920) return width / 2200;
      return 1;
    };
    const zoomPercentage = data.length > 6 ? getSize() * zoom : 100;

    const mobileDataZoom = [
      {
        type: "inside",
        show: displayZoom,
        start: 0,
        end: zoomPercentage,
      },
    ];
    const mediumDataZoom = [
      {
        type: showScrollBar ? "slider" : "inside",
        show: displayZoom,
        start: 0,
        end: zoomPercentage,
        handleStyle: {
          color: "#4D262626",
        },
        showDataShadow: false,
        handleSize: "0%",
        borderColor: "#fff",
        height: 10,
        textStyle: {
          color: "#fff",
        },
      },
    ];
    return [
      // mobile data zoom
      {
        query: {
          maxWidth: 500,
        },
        option: {
          dataZoom: mobileDataZoom,
        },
      },
      // medium data zoom
      {
        query: {
          minWidth: 501,
          maxWidth: 850,
        },
        option: {
          dataZoom: mediumDataZoom,
        },
      },
      {
        query: {
          minWidth: 851,
          maxWidth: 1280,
        },
        option: {
          dataZoom: mediumDataZoom,
        },
      },
    ];
  },
  getLabelPosition: (value, qMinMax) => {
    const { qMin, qMax } = qMinMax || { qMin: -0.5, qMax: 0.5 };

    if (value < qMin || value < qMin * 0.8) {
      return "insideLeft";
    }
    if (value < 0) {
      return "left";
    }
    if (value >= qMax * 0.8) {
      return "insideRight";
    }
    return "right";
  },
  getLabelColor: (value, qMinMax) => {
    const { qMin, qMax } = qMinMax || { qMin: -0.5, qMax: 0.5 };
    if (value < qMin || value > qMax * 0.8 || value < qMin * 0.8) {
      return "#fff";
    }
    return "#666666";
  },
  getActualPageOnWaterfall: (label, actualLocation) => {
    const cleanLabel = label
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return actualLocation.pathname.includes(cleanLabel);
  },
  getColorByLimit(value, limits, colors) {
    if (limits && limits.length > 0 && colors && colors.length > 0) {
      const arrLimits = limits.sort((a, b) => {
        if (a.value < b.value) {
          return -1;
        }
        if (a.value > b.value) {
          return 1;
        }
        return 0;
      });
      const arrColors = [];
      arrLimits.forEach((limit, index, arr) => {
        if (value < limit.value) {
          arrColors.push(colors[index]?.color);
        } else if (index === arr.length - 1) {
          arrColors.push(colors[colors.length - 1]?.color);
        }
      });
      const filtered = arrColors.filter((el) => el !== null);
      const totalColors = filtered.length;
      if (totalColors > 0) {
        // return filtered[totalColors - 1];
        return filtered[0];
      }
    }
    return colors[0]?.color || null;
  },
  getVisualization(app, id) {
    return new Promise((resolve) => {
      app.visualization
        .get(id)
        .then((vis) => {
          vis.model
            .getProperties()
            .then((properties) => resolve({ properties, vis }));
        })
        .catch(() => resolve({ error: { message: "Could not load object" } }));
    });
  },
  languageHandleQVF(language) {
    switch (language) {
      case "pt_BR":
        return "PORTUGUES";
      case "en_US":
        return "ENGLISH";
      case "es_ES":
        return "ESPANHOL";
      default:
        return "PORTUGUES";
    }
  },
  guardLanguage(language) {
    const allowedLanguages = ["pt_BR", "en_US", "es_ES"];
    if (!allowedLanguages.includes(language)) return "pt_BR";
    return language;
  },
};

export default utils;
