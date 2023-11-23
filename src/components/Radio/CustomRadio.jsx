import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function CustomRadio({
  onClick,
  values,
  initialActive,
  containerStyle,
  variable,
  app,
}) {
  const [active, setActive] = useState(initialActive || values[0].name);

  useEffect(() => {
    if (app) {
      if (variable) {
        app.variable.getContent(variable).then((res) => {
          const activeValue = values.filter(
            (value) => value.name === res.qContent.qString,
          );
          if (activeValue.length > 0) {
            setActive(res.qContent.qString);
          }
        });
      }
    }
  }, [app]);

  const handleChange = (event) => {
    setActive(event.target.value);
    onClick(event.target.value);
  };

  return (
    <div className="radio-filter-container" style={{ ...containerStyle }}>
      {values.map((element) => (
        <div style={{ marginRight: "10px" }} key={element.id}>
          <label htmlFor={element.name} className="radio-label">
            {element.name}
            <input
              className="radio-filter-input"
              type="radio"
              value={element.name}
              id={element.name}
              checked={active === element.name}
              onChange={(event) => handleChange(event, element)}
            />
            <span className="checkmark" />
          </label>
        </div>
      ))}
    </div>
  );
}

CustomRadio.defaultProps = {
  onClick: () => {},
  values: [],
  initialActive: "",
  containerStyle: {},
  variable: "",
  app: null,
};

CustomRadio.propTypes = {
  onClick: PropTypes.func,
  values: PropTypes.array,
  initialActive: PropTypes.string,
  containerStyle: PropTypes.object,
  variable: PropTypes.string,
  app: PropTypes.any,
};

export default CustomRadio;
