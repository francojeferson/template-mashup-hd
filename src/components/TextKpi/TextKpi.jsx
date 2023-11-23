import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import utils from "../../QlikUtils";
import ObjectLoader from "../ObjectLoader/ObjectLoader";
import TooltipInfo from "../TooltipInfo/TooltipInfo";

function TextKpi({ app, reference, style, containerStyle, loaderHeight }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const visRef = useRef([]);
  const mounted = useRef();

  const loadData = async () => {
    try {
      const { vis, error } =
        (await utils.getVisualization(app, reference.id)) || {};
      if (error) {
        throw new Error(error.message);
      }
      visRef.current.push(vis);
      const { qMeasureInfo } = vis.model.layout.qHyperCube;
      return {
        value: qMeasureInfo[0].qFallbackTitle,
        color: qMeasureInfo[0].valueColor.color,
      };
    } catch (error) {
      console.error({ message: error.message, objectId: reference.id });
      return null;
    }
  };

  const getTitle = async () => {
    try {
      const { vis, error } =
        (await utils.getVisualization(app, reference.title)) || {};
      if (error) {
        throw new Error(error.message);
      }
      visRef.current.push(vis);
      const { title } = vis.model.layout;
      return { title };
    } catch (error) {
      console.error({
        message: error.message,
        objectId: reference.title,
      });
      return null;
    }
  };

  useEffect(async () => {
    mounted.current = true;
    if (app) {
      if (mounted.current) {
        const resData = await loadData();
        const resTitle = await getTitle();
        setData({ ...resData, ...resTitle });
        setLoading(false);
      }
    }

    return () => {
      mounted.current = false;
      if (visRef.current?.length > 0) {
        Promise.all(visRef.current.map((ref) => ref?.close() || null));
      }
    };
  }, [app]);

  return (
    <div className="textKpiWrapper" style={{ ...containerStyle }}>
      {loading ? (
        <ObjectLoader icon="kpi" height={loaderHeight || ""} />
      ) : (
        <>
          <div className="headerTextKpiWrapper">
            <h4>{data.title}</h4>
            <TooltipInfo text={reference.tooltip} />
          </div>
          <span style={{ color: data?.color, ...style }}>{data?.value}</span>
        </>
      )}
    </div>
  );
}

TextKpi.defaultProps = {
  app: null,
  style: {},
  containerStyle: {},
  reference: {},
  loaderHeight: "",
};

TextKpi.propTypes = {
  app: PropTypes.object,
  containerStyle: PropTypes.object,
  style: PropTypes.object,
  reference: PropTypes.object,
  loaderHeight: PropTypes.string,
};

export default TextKpi;
