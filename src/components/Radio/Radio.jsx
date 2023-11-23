import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function Radio({ app, field }) {
  const { measure, defaultOption, options } = field;
  const [active, setActive] = useState(defaultOption);

  const handleChange = (value) => {
    setActive(value);
    app.field(measure).selectMatch(value);
  };

  const initializeField = async () => {
    const data = await app.field(measure).getData();
    const { rows } = data;
    const activeRow = rows.filter((row) => row.qState === "S");
    if (activeRow.length > 0) {
      setActive(activeRow[0].qText);
    }
  };

  useEffect(() => {
    if (app) {
      initializeField();
    }
  }, [app]);

  return (
    <div className="radio-filter-container">
      {options.map((element) => (
        <div style={{ marginRight: "20px" }} key={element.id}>
          <label htmlFor={element.id} className="radio-label">
            {element.name}
            <input
              className="radio-filter-input"
              type="radio"
              value={element.id}
              id={element.id}
              checked={active == element.id}
              onChange={(e) => handleChange(e.target.value)}
            />
            <span className="checkmark" />
          </label>
        </div>
      ))}
    </div>
  );
}

Radio.defaultProps = {
  app: null,
  field: {},
};

Radio.propTypes = {
  app: PropTypes.object,
  field: PropTypes.object,
};

export default Radio;
