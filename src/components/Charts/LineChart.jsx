import { styled } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import { cloneDeep } from "lodash";
import numeral from "numeral";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Utils from "../../QlikUtils";
import { ReactComponent as BarIcon } from "../../assets/icons/bar-icon.svg";
import { ReactComponent as LineIcon } from "../../assets/icons/line-icon.svg";
import { useFilters } from "../../context/Filters";
import ObjectError from "../ObjectError/ObjectError";
import ObjectLoader from "../ObjectLoader/ObjectLoader";
import appearance from "./Appearance";

const LineChartWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
});

function LineChart({
  app,
  options,
  style,
  onEvents,
  reference,
  autoDataZoom,
  echarts,
  group,
}) {
  // states
  const [data, setData] = useState();
  const [qlikData, setQlikData] = useState();
  const [finalOptions, setFinalOptions] = useState(options);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [legends, setLegends] = useState([]);
  const [externalTooltip, setExternalTooltip] = useState({});
  // ref
  const refsToClose = useRef([]);
  // hook
  const { currentPeriod } = useFilters();

  const id = reference?.period ? reference.id[currentPeriod] : reference.id;

  function getSerieStyle(serie, index) {
    let finalSerie = {};
    if (options && options.baseOption && options.baseOption.series) {
      if (options.baseOption.series[index]) {
        finalSerie = { ...options.baseOption.series[index] };
      } else {
        finalSerie = finalOptions.baseOption.series.default
          ? { ...finalOptions.baseOption.series.default }
          : { type: "line" };
      }
    } else {
      finalSerie = { type: "line" };
    }
    if (reference.format) {
      finalSerie.label = {
        ...finalSerie.label,
        formatter: (params) => {
          const value = params.value[params.seriesIndex + 1];
          const formattedValue = numeral(value)
            .format(reference.format)
            .toUpperCase();
          return formattedValue;
        },
      };
    }
    finalSerie.name = serie.qFallbackTitle || serie.qText;
    return finalSerie;
  }

  function generateTooltip(items) {
    if (
      reference.externalTooltip &&
      Object.keys(externalTooltip).length > 0 &&
      items.length
    ) {
      let html = `<div style='display: flex; font-weight: 700; align-items: center; font-size: 18px; font-stretch: condensed; color: #fff; font-family: "Public Sans";'>
            <span>${items[0].name}</span></div>`;

      const { measures, tooltipData } = externalTooltip;
      measures.forEach((measure, i) => {
        const { qFallbackTitle: title } = measure;
        const { color } = items[i];
        const value = tooltipData[items[0].dataIndex][i + 1].qNum;
        const formattedValue = reference.tooltipFormat
          ? numeral(value).format(reference.tooltipFormat)
          : value;

        html += `<div style='display: flex; align-items: center; font-size: 14px;'>
                    <span style='background-color: ${color}; width: 10px; height: 10px; border-radius: 100%;margin-right: 5px'></span>
                    <span> ${title} </span> : <span style='font-weight: bold'>&nbsp;${
                      typeof formattedValue === "number"
                        ? formattedValue
                        : formattedValue.toUpperCase()
                    }</span>
                </div>`;
      });
      return html;
    }

    if (items.length) {
      let html = `<div style='display: flex; align-items: center; font-size: 14px;"; font-stretch: condensed;>
            <span>${items[0].dimensionNames[0]}: ${items[0].value[0]}</span></div>
            `;
      for (let i = 0; i < items.length; i += 1) {
        const value = items[i].value[items[i].seriesIndex + 1];
        const { color } = items[i];
        const serieName = items[i].seriesName;
        const formattedValue = reference.tooltipFormat
          ? numeral(value).format(reference.tooltipFormat)
          : value;

        if (formattedValue === "NaN" || !formattedValue) {
          continue;
        }
        html += `<div style='display: flex; align-items: center; font-size: 14px;'>
                    <span style='background-color: ${color}; width: 10px; height: 10px; border-radius: 100%;margin-right: 5px'></span>
                    ${serieName}: <span style='font-weight: bold'>&nbsp;${
                      typeof formattedValue === "number"
                        ? formattedValue
                        : formattedValue.toUpperCase()
                    }</span>
                </div>`;
      }
      return html;
    }
  }

  function generateExternalTooltip(callback) {
    Utils.createHyperCubeByQlikIdToTable(
      app,
      reference.externalTooltip,
      100,
      (newDataTooltip, visualization) => {
        refsToClose.current.push({
          hypercube: newDataTooltip,
          vis: visualization,
        });
        const { qHyperCube } = newDataTooltip || {};
        setExternalTooltip({
          tooltipData: qHyperCube.qDataPages[0].qMatrix,
          measures: qHyperCube.qMeasureInfo,
        });
        callback();
      },
    );
  }

  useEffect(() => {
    if (!reference) {
      console.error("props 'reference' is required");
      return;
    }
    if (id) {
      Utils.createHyperCubeByQlikId(app, id, (newData, vis, title) => {
        refsToClose.current.push({ hypercube: newData, vis });
        if (newData && newData.code) {
          setError({
            message: "Could not load object",
          });
          setLoading(false);
        } else {
          if (reference.externalTooltip) {
            generateExternalTooltip(() => {
              setQlikData({
                hypercube: newData,
                model: vis.model,
                title,
              });
            });
            return;
          }
          setQlikData({
            hypercube: newData,
            model: vis.model,
            title,
          });
        }
      });
    } else if (reference.dimensions && reference.measures) {
      Utils.generateHypercube(
        app,
        false,
        reference.dimensions,
        reference.measures,
        (newData, vis, title) => {
          setQlikData({
            hypercube: newData,
            model: vis.model,
            title,
          });
        },
      );
    } else if (reference.hypercube) {
      app.createCube(reference.hypercube, (newData, vis, title) => {
        setQlikData({ hypercube: newData, model: vis.model, title });
      });
    }
    // destroying hypercube
    return () => {
      if (refsToClose.current) {
        Promise.all(
          refsToClose.current.map((ref) =>
            Utils.destroyHC(app, ref?.hypercube, ref?.vis),
          ),
        );
      }
    };
  }, []);

  // handle reference update and reload data
  useEffect(async () => {
    if (id) {
      Utils.createHyperCubeByQlikId(app, id, async (newData, vis, title) => {
        if (newData && newData.code) {
          setError({
            message: "Could not load object",
          });
          setLoading(false);
        } else {
          if (reference.externalTooltip) {
            generateExternalTooltip(() => {
              setQlikData({
                hypercube: newData,
                model: vis.model,
                title,
              });
            });
          }

          setQlikData({
            hypercube: newData,
            model: vis.model,
            title,
          });
        }
      });
    }
  }, [reference, reference.id, currentPeriod]);

  // [qlikData] happens everytime qlik data changes. trigger data changes
  useEffect(() => {
    if (qlikData) {
      const finalData = Utils.extractDataSet(qlikData.hypercube);
      setData(finalData);
    }
  }, [qlikData]);
  // [data] happens everytime dataset changes. trigger options changes

  useEffect(() => {
    if (qlikData) {
      const newOptions = cloneDeep(options);
      const { qMeasureInfo: measureInfo, qDimensionInfo: dimensionInfo } =
        qlikData.hypercube.qHyperCube || {};
      newOptions.baseOption.title = {
        ...newOptions.baseOption.title,
        text: qlikData.title,
      };
      newOptions.baseOption.tooltip.formatter = newOptions.baseOption.tooltip
        .formatter
        ? newOptions.baseOption.tooltip.formatter
        : (e) => generateTooltip(e);
      if (reference.axisFormat) {
        const { axisFormat } = reference;
        if (newOptions.baseOption.yAxis.type === "category") {
          newOptions.baseOption.xAxis = {
            ...newOptions.baseOption.xAxis,
            axisLabel: {
              ...newOptions.baseOption.xAxis.axisLabel,
              formatter: (value) =>
                numeral(value).format(axisFormat).toUpperCase(),
            },
          };
        } else {
          newOptions.baseOption.yAxis = {
            ...newOptions.baseOption.yAxis,
            axisLabel: {
              ...newOptions.baseOption.yAxis.axisLabel,
              formatter: (value) =>
                numeral(value).format(axisFormat).toUpperCase(),
            },
          };
        }
      }

      if (reference.axisTitle) {
        const axisTitles = {};
        if (dimensionInfo)
          axisTitles.x = dimensionInfo
            .map((dimension) => dimension.qFallbackTitle)
            .join(", ");
        if (measureInfo)
          axisTitles.y = measureInfo
            .map((measure) => measure.qFallbackTitle)
            .join(", ");

        const { x, y } = axisTitles || {};
        const nameTextStyle = {
          nameTextStyle: {
            fontSize: 12,
            fontWeight: 400,
            fontFamily: "Public Sans",
            color: "#8A8A8A",
            lineHeight: 16,
          },
        };

        if (x) {
          newOptions.baseOption.xAxis = {
            ...newOptions.baseOption.xAxis,
            name: axisTitles.x,
            nameLocation: "middle",
            nameGap: 36,
            ...nameTextStyle,
          };
        }

        if (y) {
          newOptions.baseOption.yAxis = {
            ...newOptions.baseOption.yAxis,
            name: axisTitles.y,
            nameLocation: "middle",
            nameGap: 60,
            ...nameTextStyle,
          };
        }
      }

      if (reference.legend) {
        const colors = [
          "#F98561",
          "#FDB949",
          "#427E89",
          "#38BC9A",
          "#9665CD",
          "#EE87BD",
          "#5176BD",
          "#55B6EB",
        ];
        const legendsArr = measureInfo.map((measure, index) => ({
          title: measure.qFallbackTitle,
          color: colors[index],
        }));
        setLegends(legendsArr);
      }

      const series = [];
      const stackedData = qlikData.hypercube.qHyperCube.qStackedDataPages;
      if (stackedData.length > 0) {
        const subnodes = stackedData[0].qData[0].qSubNodes;
        subnodes[0].qSubNodes.forEach((item, index) => {
          series.push(getSerieStyle(item, index));
        });
      } else {
        measureInfo.forEach((item, index) => {
          series.push(getSerieStyle(item, index));
        });
      }
      newOptions.baseOption.series = series;
      newOptions.baseOption.dataset = { source: data };
      if (autoDataZoom) {
        const dataZoomOptions = {};
        if (reference.zoom) dataZoomOptions.zoom = reference.zoom;
        const generatedMedia = Utils.generateDataZoomMedias(
          data,
          dataZoomOptions,
        );
        newOptions.media = newOptions.media.concat(generatedMedia);
      }
      setFinalOptions(newOptions);
    }
  }, [data, externalTooltip]);
  // [options] happens everytime options changes

  useEffect(() => {
    if (
      finalOptions &&
      finalOptions.baseOption &&
      finalOptions.baseOption.dataset
    ) {
      setLoading(false);
    }
  }, [finalOptions]);

  const connectChartToGroup = () => (chart) => {
    if (group && echarts) {
      chart.group = group;
      echarts.connect(group);
    }
  };

  return (
    <div className="lineChartWrapper" style={style}>
      {error ? (
        <ObjectError message={error.message} />
      ) : loading ? (
        <ObjectLoader icon="linechart" />
      ) : (
        <LineChartWrapper>
          {legends?.length > 0 && (
            <div className="legend">
              <span>Legenda</span>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "auto hidden",
                  display: "flex",
                }}
              >
                {legends.map((legend, index) => {
                  let icon = <LineIcon stroke={legend.color} />;
                  if (legend.type === "bar") {
                    icon = <BarIcon fill="#55B6EB" />;
                  }
                  return (
                    <div key={index} className="legend-item">
                      <div className="legend-item-icon">{icon}</div>
                      <span className="legend-item-name">{legend.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <ReactEcharts
            notMerge
            lazyUpdate
            option={finalOptions}
            style={{ height: "100%", width: "100%" }}
            onEvents={onEvents}
            onChartReady={connectChartToGroup()}
          />
        </LineChartWrapper>
      )}
    </div>
  );
}

LineChart.defaultProps = {
  app: null,
  reference: null,
  style: {},
  options: appearance.linechart(),
  onEvents: null,
  autoDataZoom: false,
  group: null,
  echarts: null,
};

LineChart.propTypes = {
  app: PropTypes.object,
  reference: PropTypes.object,
  style: PropTypes.object,
  options: PropTypes.object,
  onEvents: PropTypes.object,
  autoDataZoom: PropTypes.bool,
  group: PropTypes.string,
  echarts: PropTypes.object,
};

export default LineChart;
