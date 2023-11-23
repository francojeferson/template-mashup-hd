import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as IconLinechart } from "../../assets/icons/line-chart.svg";
import { ReactComponent as IconBarchart } from "../../assets/icons/bar-chart.svg";
import { ReactComponent as IconGauge } from "../../assets/icons/gauge.svg";
import { ReactComponent as IconKPI } from "../../assets/icons/kpi.svg";
import { ReactComponent as IconPiechart } from "../../assets/icons/pie-chart.svg";
import { ReactComponent as IconScatterchart } from "../../assets/icons/scatter.svg";
import { ReactComponent as IconTable } from "../../assets/icons/table.svg";
import { ReactComponent as IconMap } from "../../assets/icons/map.svg";
import { ReactComponent as IconCircle } from "../../assets/icons/circle-regular.svg";

function ObjectLoader({ icon, color, height, width, className }) {
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

ObjectLoader.defaultProps = {
  icon: "table",
  color: "red",
  height: "20px",
  width: "20px",
  className: "",
};

ObjectLoader.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  className: PropTypes.string,
};

export default ObjectLoader;
