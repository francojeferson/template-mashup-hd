import PropTypes from "prop-types";
import IconBarchart from "../../assets/icons/bar-chart.svg?react";
import IconCircle from "../../assets/icons/circle-regular.svg?react";
import IconGauge from "../../assets/icons/gauge.svg?react";
import IconKPI from "../../assets/icons/kpi.svg?react";
import IconLinechart from "../../assets/icons/line-chart.svg?react";
import IconMap from "../../assets/icons/map.svg?react";
import IconPiechart from "../../assets/icons/pie-chart.svg?react";
import IconScatterchart from "../../assets/icons/scatter.svg?react";
import IconTable from "../../assets/icons/table.svg?react";

function ObjectLoader({
  icon = "table",
  color = "red",
  height = "20px",
  width = "20px",
  className = "",
}) {
  const icons = {
    linechart: <IconLinechart fill={color} />,
    barchart: <IconBarchart fill={color} />,
    gauge: <IconGauge fill={color} />,
    kpi: <IconKPI fill={color} />,
    piechart: <IconPiechart fill={color} />,
    scatterchart: <IconScatterchart fill={color} />,
    scatterplot: <IconScatterchart fill={color} />,
    table: <IconTable fill={color} />,
    map: <IconMap fill={color} />,
    circle: <IconCircle fill={color} />,
  };

  return (
    <div
      className={`${className} objectLoader`}
      style={{ height: height, width: width }}
    >
      {icons[icon]}
    </div>
  );
}

ObjectLoader.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  className: PropTypes.string,
};

export default ObjectLoader;
