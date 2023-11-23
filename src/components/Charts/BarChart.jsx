/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import ReactEcharts from "echarts-for-react";
import { cloneDeep } from "lodash";
import numeral from "numeral";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Utils from "../../QlikUtils";
import { useFilters } from "../../context/Filters";
import FilterMessage from "../FilterMessage/FilterMessage";
import ObjectError from "../ObjectError/ObjectError";
import ObjectLoader from "../ObjectLoader/ObjectLoader";
import Appearance from "./Appearance";

function BarChart({
  app,
  options,
  style,
  reference,
  autoDataZoom,
  echarts,
  group,
  multiTooltip,
  horizontal,
  showScrollBar,
}) {
  // states
  const [data, setData] = useState(null);
  const [qlikData, setQlikData] = useState(null);
  const [finalOptions, setFinalOptions] = useState(options);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterNeeded, setFilterNeeded] = useState("");
  const refsToClose = useRef(null);
  // hooks
  const { currentPeriod } = useFilters();
  // consts
  const id = reference?.period ? reference.id[currentPeriod] : reference.id;

  function getSerieStyle(serie) {
    const finalSerie = { ...serie };
    finalSerie.barWidth = reference?.barWidth || 41;
    finalSerie.label = {
      show: true,
      formatter: (params) => params.data.formattedValue.toUpperCase(),
    };
    finalSerie.color = {
      color: (params) => params.color,
    };
    return finalSerie;
  }
  function generateTooltip(items) {
    let html;

    if (!multiTooltip) {
      if (items.length) {
        const { value } = items[0];
        const { color } = items[0];
        const serieName = items[0].name;
        const formattedValue = reference.tooltipFormat
          ? numeral(value).format(reference.tooltipFormat)
          : items[0].data.formattedValue;

        if (formattedValue === "NaN" || !formattedValue) {
          return;
        }
        html = `<div style='display: flex; align-items: center; font-size: 14px;'>
                      <span style='background-color: ${color}; width: 10px; height: 10px; border-radius: 100%;margin-right: 5px'></span>
                      ${serieName}: <span style='font-weight: bold'>&nbsp;${
                        typeof formattedValue === "number"
                          ? formattedValue
                          : formattedValue.toUpperCase()
                      }</span>
                </div>`;

        return html;
      }
    } else {
      if (items.length) {
        html = `<div
            style='
              display: flex;
              align-items: start;
              font-size: 14px;
              justify-content: start;
              flex-direction: column;
            '
          >
            ${items.map((content, index) => {
              return `
              <div style='display: flex; align-items: center; justify-content: start'>
              <span
                style='
                  background-color: ${content.color};
                  width: 10px;
                  height: 10px;
                  border-radius: 100%;
                  margin-right: 5px;
                '
              /></span>
              ${index === 0 ? "Meta" : "Realizado"}:
              <span
                style='
                  font-weight: bold;
                '
              >
                &nbsp;
                ${
                  reference.tooltipFormat
                    ? numeral(content.data.formattedValue)
                        .format(reference.tooltipFormat)
                        .toUpperCase()
                    : content.data.formattedValue
                }
              </span>
              </div>
              `;
            })}
          </div>`;
        let tmp = html.replace(",", "");
        return tmp;
      }
    }
  }

  function needFilter(message) {
    if (message && message !== "") {
      setFilterNeeded(message);
      setLoading(false);
      return true;
    }
    setLoading(false);
    setFilterNeeded("");
    return false;
  }

  useEffect(() => {
    if (!reference) {
      console.error("props 'reference' is required");
      return;
    }
    if (id) {
      Utils.createHyperCubeByQlikId(app, id, (newData, vis, title) => {
        refsToClose.current = { hypercube: newData, vis };

        if (needFilter(newData.qHyperCube.qCalcCondMsg)) {
          return;
        }
        if (newData && newData.code) {
          setError({
            message: "Could not load object",
          });
          setLoading(false);
        } else {
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
        Utils.destroyHC(
          app,
          refsToClose.current?.hypercube,
          refsToClose.current?.vis,
        );
      }
    };
  }, [reference, currentPeriod]);
  // [qlikData] happens everytime qlik data changes. trigger data changes

  useEffect(() => {
    if (qlikData) {
      refsToClose.current = {
        hypercube: qlikData.hypercube,
        vis: qlikData.vis,
      };
      // const finalData = Utils.extractDataSet(qlikData.hypercube);
      Utils.extractData(
        qlikData.hypercube,
        "bar",
        reference.format,
        horizontal,
      ).then((finalData) => {
        setData(finalData);
      });
    }
  }, [qlikData]);
  // [data] happens everytime dataset changes. trigger options changes

  useEffect(() => {
    if (data) {
      const newOptions = cloneDeep(options);
      // const measureInfo = qlikData.hypercube.qHyperCube.qMeasureInfo;
      if (reference.title) {
        newOptions.baseOption.title = {
          ...newOptions.baseOption.title,
          text: qlikData.title,
        };
      }
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
              formatter: (value) =>
                numeral(value).format(axisFormat).toUpperCase(),
            },
          };
        } else {
          newOptions.baseOption.yAxis = {
            ...newOptions.baseOption.yAxis,
            axisLabel: {
              formatter: (value) =>
                numeral(value).format(axisFormat).toUpperCase(),
            },
          };
        }
      }

      if (newOptions.baseOption.yAxis.type === "category") {
        newOptions.baseOption.yAxis = {
          ...newOptions.baseOption.yAxis,
          data: data.labels,
        };
      } else {
        newOptions.baseOption.xAxis = {
          ...newOptions.baseOption.xAxis,
          data: data.labels,
        };
      }

      const series = [];
      data.series.forEach((item, index) => {
        series.push(getSerieStyle(item, index));
      });
      newOptions.baseOption.series = series;
      if (autoDataZoom) {
        const option = {};
        if (showScrollBar) option.showScrollBar = true;
        if (reference.zoom) option.zoom = reference.zoom;
        const generatedMedia = Utils.generateDataZoomMedias(
          series[0].data,
          option,
        );
        if (newOptions?.media) {
          newOptions.media = newOptions.media.concat(generatedMedia);
        } else {
          newOptions.media = generatedMedia;
        }
      }
      setFinalOptions(newOptions);
    }
  }, [data]);
  // [options] happens everytime options changes

  useEffect(() => {
    if (
      finalOptions &&
      finalOptions.baseOption &&
      finalOptions.baseOption.series.length
    ) {
      setLoading(false);
    }
  }, [finalOptions]);

  const connectChartToGroup = () => (chart) => {
    if (group && echarts) {
      // eslint-disable-next-line no-param-reassign
      chart.group = group;
      echarts.connect(group);
    }
  };

  const render = () => {
    if (error) {
      return <ObjectError message={error.message} />;
    }
    if (loading) {
      return <ObjectLoader icon="barchart" />;
    }
    if (filterNeeded !== "") {
      return <FilterMessage message={filterNeeded} />;
    }
    return (
      <ReactEcharts
        option={finalOptions}
        notMerge
        lazyUpdate
        onChartReady={connectChartToGroup()}
        style={{ height: "100%", width: "100%" }}
      />
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "end",
        justifyContent: "center",
        ...style,
      }}
    >
      {render()}
    </div>
  );
}

BarChart.defaultProps = {
  app: null,
  reference: null,
  style: {},
  options: Appearance.barchart(),
  autoDataZoom: false,
  group: null,
  echarts: null,
  horizontal: false,
  multiTooltip: false,
  showScrollBar: false,
};

BarChart.propTypes = {
  app: PropTypes.object,
  reference: PropTypes.object,
  style: PropTypes.object,
  options: PropTypes.object,
  autoDataZoom: PropTypes.bool,
  group: PropTypes.string,
  echarts: PropTypes.object,
  horizontal: PropTypes.bool,
  multiTooltip: PropTypes.bool,
  showScrollBar: PropTypes.bool,
};

export default BarChart;
