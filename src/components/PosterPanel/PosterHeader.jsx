import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import TooltipInfo from "../TooltipInfo/TooltipInfo";

function PosterHeader({ app, reference }) {
  const visRef = useRef();
  const mounted = useRef();

  const [title, setTitle] = useState("");
  const getVisData = async () =>
    await app.visualization.get(reference.title).then((visualizationRes) => {
      visRef.current = visualizationRes;
      visualizationRes.model.getProperties().then((modelRes) => {
        setTitle(modelRes?.title || "");
      });
    });

  useEffect(() => {
    mounted.current = true;
    if (app && mounted.current) {
      getVisData();
    }
    return () => {
      mounted.current = false;
      if (visRef.current) {
        visRef.current.close();
      }
    };
  }, [app]);

  return (
    <div className="titleWrapper">
      <div className="title">
        {reference.hardTitle || title}
        {reference.tooltip && (
          <TooltipInfo
            style={{ marginLeft: "10px" }}
            text={reference.tooltip}
          />
        )}
      </div>
      <span className="subtitle">{reference.subtitle || ""}</span>
    </div>
  );
}

PosterHeader.defaultProps = {
  reference: {},
};

PosterHeader.propTypes = {
  app: PropTypes.object.isRequired,
  reference: PropTypes.object,
};

export default PosterHeader;
