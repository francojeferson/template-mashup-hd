import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import ObjectLoader from "../ObjectLoader/ObjectLoader";

function NativeObject({ app, reference, className, style, type }) {
  const ref = useRef();
  const visRef = useRef();

  useEffect(() => {
    if (reference.id) {
      app.visualization.get(reference.id).then((vis) => {
        visRef.current = vis;
        vis.show(ref.current);
      });
    }

    return () => {
      if (visRef.current) {
        visRef.current.close();
      }
    };
  }, []);
  return (
    <div
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
      ref={ref}
    >
      <ObjectLoader icon={type || "circle"} width="inherit" height="inherit" />
    </div>
  );
}

NativeObject.defaultProps = {
  app: null,
  reference: {},
  className: "",
  style: {},
  type: "",
};

NativeObject.propTypes = {
  app: PropTypes.object,
  reference: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
  type: PropTypes.string,
};

export default React.memo(NativeObject, (prevProps, nextProps) => {
  // React memo acts like the old ComponentShouldUpdate from React classes.
  // Use it wisely!

  const areEqual =
    prevProps.reference.id === nextProps.reference.id &&
    prevProps.app.id === nextProps.app.id &&
    prevProps.className === nextProps.className;

  return areEqual;
});
