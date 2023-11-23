import ReactEcharts from "echarts-for-react";
import { cloneDeep } from "lodash";
import numeral from "numeral";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Utils from "../../QlikUtils";
import ObjectLoader from "../ObjectLoader/ObjectLoader";
import appearance from "./Appearance";

function BarChartDataProps({
  data,
  measures,
  labels,
  waterfallConnected,
  options,
  style,
  reference,
  onEvents,
  autoDataZoom,
  echarts,
  group,
}) {
  const [finalOptions, setFinalOptions] = useState(options);
  const [loading, setLoading] = useState(true);

  function getSerieStyle(serie) {
    return {
      name: serie.qFallbackTitle || serie.qText,
      type: "bar",
      label: {
        show: true,
        formatter: (params) => params.data.formattedValue,
      },
      itemStyle: {
        color: (params) => params.data.color,
      },
      data: waterfallConnected
        ? [
            { value: 0, label: { normal: { show: false } } },
            ...data,
            { value: 0, label: { normal: { show: false } } },
          ]
        : data,
    };
  }
  function generateTooltip(items) {
    if (!items.length || !items[0].data.formattedValue) {
      return "";
    }
    const item = items[0];
    let html = `<div style='display: flex; align-items: center; font-size: 14px;"; font-stretch: condensed'>
             <span>${item.seriesName}</span></div>
             `;
    const value = item.data.formattedValue;
    const { color } = item;
    const { itemName } = item.data;
    const formattedValue = reference.tooltipFormat
      ? numeral(value).format(reference.tooltipFormat)
      : value;

    html += `<div style='display: flex; align-items: center; font-size: 14px;'>
                     <span style='background-color: ${color}; width: 10px; height: 10px; border-radius: 100%;margin-right: 5px'></span>
                     ${itemName}: <span style='font-weight: bold'>&nbsp;${
                       typeof formattedValue === "number"
                         ? formattedValue
                         : formattedValue.toUpperCase()
                     }</span>
                 </div>`;
    return html;
  }

  // happens everytime data props changes. trigger options changes
  useEffect(() => {
    if (data) {
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
        data: waterfallConnected ? ["MAT", ...labels, "LAST MAT"] : labels,
      };

      const series = [];
      measures.forEach((item) => {
        series.push(getSerieStyle(item));
      });
      newOptions.baseOption.series = series;
      if (autoDataZoom) {
        const generatedMedia = Utils.generateDataZoomMedias(data);
        newOptions.media = newOptions.media.concat(generatedMedia);
      }
      setFinalOptions(newOptions);
    }
  }, [data]);

  // [options] happens everytime options changes
  useEffect(() => {
    if (finalOptions.baseOption.series.length > 0) {
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
    <div
      style={{
        ...style,
        width: style.width || "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <ObjectLoader icon="piechart" />
      ) : (
        <ReactEcharts
          notMerge
          lazyUpdate
          option={finalOptions}
          style={{ height: "100%", width: "100%" }}
          onEvents={onEvents}
          onChartReady={connectChartToGroup()}
          opts={{ renderer: "svg" }}
        />
      )}
    </div>
  );
}

BarChartDataProps.defaultProps = {
  data: null,
  labels: [],
  measures: [],
  reference: {},
  waterfallConnected: false,
  style: {},
  options: appearance.barchart(),
  onEvents: null,
  autoDataZoom: false,
  group: null,
  echarts: null,
};

BarChartDataProps.propTypes = {
  data: PropTypes.array,
  labels: PropTypes.array,
  measures: PropTypes.array,
  reference: PropTypes.object,
  waterfallConnected: PropTypes.bool,
  style: PropTypes.object,
  options: PropTypes.object,
  onEvents: PropTypes.object,
  autoDataZoom: PropTypes.bool,
  group: PropTypes.string,
  echarts: PropTypes.object,
};

export default BarChartDataProps;
