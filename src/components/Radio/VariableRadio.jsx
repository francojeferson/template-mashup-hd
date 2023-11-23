import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function VariableRadio({ app, values, variable, setActualValue }) {
  const [active, setActive] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (app) {
      if (variable) {
        app.variable.getContent("vTipoSelecaoPDV").then((res) => {
          const actualString = res.qContent.qString.trim();
          const activeValue = values.filter(
            (value) => value.name === actualString,
          );
          if (activeValue.length > 0) {
            setActive(actualString);
            setActualValue(actualString);
            setLoaded(true);
          }
        });
      }
    }
  }, [app]);

  const handleChange = (event) => {
    app.variable.setStringValue(variable, event.target.value);
    setActive(event.target.value);
    setActualValue(event.target.value);
  };

  if (!loaded) {
    return <span>loading</span>;
  }

  if (loaded) {
    return (
      <div className="radio-filter-container">
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
}

VariableRadio.defaultProps = {
  app: null,
  values: [],
  variable: "",
  setActualValue: () => {},
};

VariableRadio.propTypes = {
  app: PropTypes.any,
  values: PropTypes.array,
  variable: PropTypes.string,
  setActualValue: PropTypes.func,
};

export default VariableRadio;
