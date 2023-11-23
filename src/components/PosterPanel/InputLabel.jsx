import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import NativeObject from "../NativeObject/NativeObject";

function InputLabel({ app, reference }) {
  const visRef = useRef();
  const [label, setLabel] = useState("");
  const getVisData = async () =>
    await app.visualization.get(reference.id).then((visualizationRes) => {
      visRef.current = visualizationRes;
      visualizationRes.model.getProperties().then((modelRes) => {
        setLabel(modelRes?.title || "");
      });
    });

  useEffect(() => {
    if (app) {
      getVisData();
    }
    return () => {
      if (visRef.current) {
        visRef.current.close();
      }
    };
  }, [app]);

  return (
    <div className="comboLabel">
      <span className="title" htmlFor="inputId">
        {reference.hardLabel || label}
      </span>
      <NativeObject
        app={app}
        reference={{ id: reference.input }}
        style={{ width: "40px", height: "40px", minWidth: "40px" }}
      />
    </div>
  );
}

InputLabel.defaultProps = {
  reference: {},
};

InputLabel.propTypes = {
  app: PropTypes.object.isRequired,
  reference: PropTypes.object,
};

export default InputLabel;
