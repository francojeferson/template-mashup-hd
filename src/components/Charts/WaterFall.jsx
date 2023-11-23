import ReactEcharts from "echarts-for-react";
import { cloneDeep } from "lodash";
import numeral from "numeral";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Utils from "../../QlikUtils";
import ObjectLoader from "../ObjectLoader/ObjectLoader";
import appearance from "./Appearance";

function Waterfall({ app, style, reference, options }) {
  // const [finalOptions, setFinalOptions] = useState(options);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState();
  const [finalOptions, setFinalOptions] = useState(appearance.waterfall);
  const chartRef = useRef();
  const location = useLocation();
  const refsToClose = useRef();

  function getColorWaterfall(value, color, index, arr) {
    const { positiveValue, negativeValue, subtotal } = color;
    if (index === 0 || index === arr.length - 1)
      return subtotal.paletteColor.color;
    return value > 0
      ? positiveValue.paletteColor.color
      : negativeValue.paletteColor.color;
  }

  function getLabelColorWaterfall(value, values) {
    const { first, last } = values;
    if (value === first || value === last) return "white";
    return "#666";
  }

  function getLabelWatefallPosition(value, values) {
    const { max, first, last } = values;
    const range = max / 0.8;
    if (value < range) {
      return "left";
    }
    if (value > range) {
      return "right";
    }
    if (value === first || value === last) {
      return "insideRight";
    }
    return "left";
  }

  function getDataFromReference() {
    Utils.createHyperCubeByQlikId(app, reference.id, (newData, vis) => {
      refsToClose.current = { hypercube: newData, vis };
      const { color } = vis.model.layout;
      const { qMeasureInfo, qDataPages } = newData.qHyperCube;
      const labels = qMeasureInfo.map((item) => item.qFallbackTitle);
      const first = qDataPages[0].qMatrix[0][0].qNum;
      const last =
        qDataPages[0].qMatrix[0][qDataPages[0].qMatrix[0].length - 1].qNum;
      const max = Math.max(qDataPages[0].qMatrix[0].map((item) => item.qNum));

      const data = qDataPages[0].qMatrix[0].map((item, i, arr) => {
        const actualPageLabel = Utils.getActualPageOnWaterfall(
          labels[i],
          location,
        );

        return {
          value: item.qNum,
          formattedValue: item.qText,
          label: {
            normal: {
              position: getLabelWatefallPosition(item.qNum, {
                max,
                first,
                last,
              }),
              color: actualPageLabel
                ? "#000"
                : getLabelColorWaterfall(item.qNum, {
                    max,
                    first,
                    last,
                  }),

              fontFamily: "Public Sans",
              fontStyle: "bold",
              value: labels[i],
            },
          },
          itemStyle: {
            color: getColorWaterfall(item.qNum, color, i, arr),
          },
        };
      });

      const noStyleData = data.map((item) => {
        const { itemStyle, ...rest } = item;
        return rest;
      });

      setChartData({
        data,
        noStyleData,
        labels,
        firstData: data[0],
        lastData: data[data.length - 1],
      });
    });
  }

  function getSerieStyle() {
    const { data, noStyleData, firstData, lastData } = chartData;
    noStyleData.shift();
    noStyleData.pop();
    data.shift();
    data.pop();
    const dataWithParsedNegativeValues = data.map((item) => {
      const { value } = item;
      return item.value < 0 ? { ...item, value: value * -1 } : item;
    });
    const mainValue = firstData.value;
    let previousValue = mainValue;
    const transparentData = [];
    noStyleData.forEach((item) => {
      const newItem = {
        ...item,
      };
      const newValue =
        newItem.value < 0 ? previousValue + item.value : previousValue;
      newItem.value = newValue;
      previousValue = newValue + item.value;
      transparentData.push(newItem);
    });
    const transparentSerie = {
      name: "transparent",
      type: "bar",
      stack: "waterfall",
      // barMinHeight: 1,
      label: {
        show: false,
      },
      itemStyle: {
        color: "transparent",
      },
      data: [{ value: 0 }, ...transparentData, { value: 0 }],
    };
    const serieStyle = {
      name: "",
      type: "bar",
      stack: "waterfall",
      // barMinHeight: 1,
      label: {
        show: true,
        formatter: (params) => params.data.formattedValue,
      },
      itemStyle: {
        color: "#55B6EB",
      },
      data: [firstData, ...dataWithParsedNegativeValues, lastData],
    };
    return [transparentSerie, serieStyle];
  }

  function generateTooltip(items) {
    if (!items.length || !items[0].data.formattedValue) {
      return "";
    }

    const item = items[1];
    let html = `<div style='display: flex; align-items: center; font-size: 14px;"; font-stretch: condensed'>
             <span>${item.seriesName}</span></div>
             `;
    const value = item.data.formattedValue;
    const { color } = item;
    const { label } = item.data;
    const formattedValue = reference.tooltipFormat
      ? numeral(value).format(reference.tooltipFormat)
      : value;

    html += `<div style='display: flex; align-items: center; font-size: 14px;'>
                     <span style='background-color: ${color}; width: 10px; height: 10px; border-radius: 100%;margin-right: 5px'></span>
                     ${label.value}: <span style='font-weight: bold'>&nbsp;${
                       typeof formattedValue === "number"
                         ? formattedValue
                         : formattedValue.toUpperCase()
                     }</span>
                 </div>`;
    return html;
  }

  useEffect(() => {
    getDataFromReference();

    return () => {
      if (refsToClose.current) {
        Utils.destroyHC(
          app,
          refsToClose.current?.hypercube,
          refsToClose.current?.vis,
        );
      }
    };
  }, []);

  useEffect(() => {
    if (chartData) {
      const { data, labels } = chartData;
      const newOptions = cloneDeep(options);
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

      newOptions.baseOption.yAxis = {
        ...newOptions.baseOption.yAxis,
        data: labels.map((label) => {
          const actualPage = Utils.getActualPageOnWaterfall(label, location);
          return {
            value: label,
            textStyle: {
              color: actualPage ? "#000" : "#999",
              fontWeight: actualPage ? "bold" : "normal",
            },
          };
        }),
      };

      const newSeries = getSerieStyle(data);

      newOptions.baseOption.series = newSeries;
      setFinalOptions(newOptions);
    }
  }, [chartData]);

  // [options] happens everytime options changes
  useEffect(() => {
    if (finalOptions.baseOption.series.length > 0) {
      setLoading(false);
    }
  }, [finalOptions]);

  return (
    <div
      style={{
        ...style,
        width: style.width || "100%",
        height: style.height || "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <ObjectLoader icon="barchart" />
      ) : (
        <ReactEcharts
          notMerge
          lazyUpdate
          option={finalOptions}
          style={{ height: "100%", width: "100%" }}
          // onEvents={onEvents}
          opts={{ renderer: "svg" }}
          ref={chartRef}
        />
      )}
    </div>
  );
}

Waterfall.defaultProps = {
  app: null,
  style: {},
  options: appearance.waterfall(),
};

Waterfall.propTypes = {
  app: PropTypes.object,
  style: PropTypes.object,
  reference: PropTypes.object.isRequired,
  options: PropTypes.object,
};

export default Waterfall;
