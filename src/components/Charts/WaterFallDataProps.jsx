import ReactEcharts from "echarts-for-react";
import { cloneDeep } from "lodash";
import numeral from "numeral";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Utils from "../../QlikUtils";
import ObjectLoader from "../ObjectLoader/ObjectLoader";
import appearance from "./Appearance";

function WaterfallDataProps({
  data,
  measures,
  labels,
  firstBar,
  lastBar,
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

  function getSerieStyle(measure) {
    const backwardsData = data.slice().reverse();
    const dataWithParsedNegativeValues = data.map((item) => {
      const { value } = item;
      return item.value < 0 ? { ...item, value: value * -1 } : item;
    });
    const mainValue = firstBar.value;
    let previousValue = mainValue;
    const transparentData = [];
    backwardsData.forEach((item) => {
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
      name: measure.qFallbackTitle || measure.qText,
      type: "bar",
      stack: "waterfall",
      label: {
        show: false,
      },
      itemStyle: {
        color: "transparent",
      },
      data: [{ value: 0 }, ...transparentData.reverse(), { value: 0 }],
    };
    const serieStyle = {
      name: measure.qFallbackTitle || measure.qText,
      type: "bar",
      stack: "waterfall",
      label: {
        show: true,
        formatter: (params) => params.data.formattedValue,
      },
      itemStyle: {
        color: (params) => params.data.color,
      },
      data: [lastBar, ...dataWithParsedNegativeValues, firstBar],
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
        data: labels,
      };

      const series = [];
      measures.forEach((item) => {
        const newSeries = getSerieStyle(item);
        series.push(...newSeries);
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
        <ObjectLoader icon="piechart" margin="0 auto" />
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

WaterfallDataProps.defaultProps = {
  data: null,
  labels: [],
  measures: [],
  firstBar: {},
  lastBar: {},
  reference: {},
  style: {},
  options: appearance.waterfall(),
  onEvents: null,
  autoDataZoom: false,
  group: null,
  echarts: null,
};

WaterfallDataProps.propTypes = {
  data: PropTypes.array,
  labels: PropTypes.array,
  measures: PropTypes.array,
  firstBar: PropTypes.object,
  lastBar: PropTypes.object,
  reference: PropTypes.object,
  style: PropTypes.object,
  options: PropTypes.object,
  onEvents: PropTypes.object,
  autoDataZoom: PropTypes.bool,
  group: PropTypes.string,
  echarts: PropTypes.object,
};

export default WaterfallDataProps;
