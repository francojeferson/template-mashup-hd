import * as d3 from "d3";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { VennDiagram } from "venn.js";

import Utils from "../../QlikUtils";
import FilterMessage from "../FilterMessage/FilterMessage";
import ObjectError from "../ObjectError/ObjectError";
import ObjectLoader from "../ObjectLoader/ObjectLoader";

const Venn = ({ app, reference, style }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterNeeded, setFilterNeeded] = useState("");
  const chartRef = useRef(null);
  const refsToClose = useRef(null);

  const needFilter = (hypercube) => {
    if (hypercube?.qCalcCondMsg) {
      setFilterNeeded(hypercube.qCalcCondMsg);
      setLoading(false);
      return true;
    }
    setLoading(false);
    setFilterNeeded("");
    return false;
  };

  useEffect(() => {
    if (reference?.id) {
      Utils.createHyperCubeByQlikId(app, reference.id, (newData, vis) => {
        refsToClose.current = { hypercube: newData, vis };
        if (newData && newData.code) {
          setError({
            message: "Could not load object",
          });
          setLoading(false);
          return;
        }

        if (needFilter(newData.qHyperCube)) {
          return;
        }
        const matrix = newData.qHyperCube.qDataPages[0].qMatrix[0];
        const seriesData = [
          {
            sets: ["A"],
            size: matrix[7].qNum,
            label: matrix[0].qText,
          },
          {
            sets: ["A", "B"],
            size: matrix[1].qNum,
            label: matrix[1].qText,
          },
          {
            sets: ["B"],
            size: matrix[8].qNum,
            label: matrix[2].qText,
          },
          {
            sets: ["B", "C"],
            size: matrix[3].qNum,
            label: matrix[3].qText,
          },
          {
            sets: ["C"],
            size: matrix[9].qNum,
            label: matrix[4].qText,
          },
          {
            sets: ["A", "C"],
            size: matrix[5].qNum,
            label: matrix[5].qText,
          },
          {
            sets: ["A", "B", "C"],
            size: matrix[6].qNum,
            label: matrix[6].qText,
          },
        ];
        setData(seriesData);
        setLoading(false);
      });
    }

    return () => {
      if (refsToClose.current) {
        Utils.destroyHC(
          app,
          refsToClose.current?.hypercube,
          refsToClose.current?.vis,
        );
        setLoading(true);
        setData([]);
        setFilterNeeded("");
      }
    };
  }, [reference.id]);

  useEffect(() => {
    if (data && data.length > 0 && chartRef.current) {
      const chart = VennDiagram().width(250).height(150);
      chart.orientationOrder((a, b) => a.setid.localeCompare(b.setid));
      d3.select(chartRef.current).datum(data).call(chart);

      const vennDiv = document.getElementById("venn");
      const vennSvg = vennDiv.children[0];

      d3.selectAll("#venn .venn-circle text")
        .style("font-size", "16px")
        .style("font-weight", "100");

      vennDiv.setAttribute("class", "svg-container content-height");
      vennSvg.removeAttribute("height");
      vennSvg.removeAttribute("width");
      vennSvg.setAttribute("viewBox", "0 0 250 150");
      vennSvg.setAttribute("preserveAspectRatio", "xMaxYMin meet");
      vennSvg.setAttribute("class", "svg-content-responsive");
      setLoading(false);
    }
  }, [data, chartRef]);

  if (loading) {
    return <ObjectLoader icon="circle" width="inherit" height="inherit" />;
  }

  return (
    <div style={{ ...style }}>
      {error ? (
        <ObjectError message={error.message} />
      ) : filterNeeded !== "" ? (
        <FilterMessage message={filterNeeded} />
      ) : (
        <div
          style={{ height: "100%" }}
          id="venn"
          className="venn"
          ref={chartRef}
        />
      )}
    </div>
  );
};

Venn.defaultProps = {
  app: null,
  reference: {},
  style: {},
};
Venn.propTypes = {
  app: PropTypes.object,
  reference: PropTypes.object,
  style: PropTypes.object,
};

export default Venn;
