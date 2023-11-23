import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

function NativeFilter({
  app,
  reference,
  className,
  onClick,
  style,
  noInteraction,
  containerStyle,
}) {
  const ref = useRef();
  const visRef = useRef();

  useEffect(() => {
    if (reference.id && app && app.visualization) {
      app.visualization
        .get(reference.id)
        .then((vis) => {
          visRef.current = vis;
          vis.show(ref.current);
        })
        .catch((error) => {
          console.error("Error getting visualization:", error);
        });
    }

    return () => {
      if (visRef.current) visRef.current.close();
    };
  }, []);

  return (
    <div
      className={
        noInteraction ? "nativeFilter is-non-interactive" : "nativeFilter"
      }
      onClick={(e) => {
        if (reference && onClick) {
          onClick({ ...e, ...reference });
        }
      }}
      style={containerStyle}
    >
      <div
        style={style || { width: "100%", height: "100%" }}
        className={className}
        ref={ref}
      >
        <div className="qlik-object-loader spinner">
          <div className="double-bounce1" />
          <div className="double-bounce2" />
        </div>
      </div>
    </div>
  );
}

NativeFilter.defaultProps = {
  app: null,
  reference: {},
  className: "",
  style: {},
  onClick: function () {},
  noInteraction: false,
  containerStyle: {},
};

NativeFilter.propTypes = {
  app: PropTypes.object,
  reference: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  noInteraction: PropTypes.bool,
  containerStyle: PropTypes.object,
};

export default React.memo(NativeFilter, (prevProps, nextProps) => {
  // React memo acts like the old ComponentShouldUpdate from React classes.
  // Use it wisely!

  const areEqual =
    prevProps.reference.id === nextProps.reference.id &&
    prevProps.app.id === nextProps.app.id &&
    prevProps.className === nextProps.className;

  return areEqual;
});
