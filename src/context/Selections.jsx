import { createContext, useContext, useState } from "react";

import PropTypes from "prop-types";

const SelectionsContext = createContext();

function SelectionsProvider({ children }) {
  const [selections, setSelections] = useState([]);

  return (
    <SelectionsContext.Provider value={{ selections, setSelections }}>
      {children}
    </SelectionsContext.Provider>
  );
}

function useSelections() {
  const context = useContext(SelectionsContext);

  if (!context) {
    throw new Error("useSelections should be used within a SelectionsProvider");
  }

  return context;
}

SelectionsProvider.defaultProps = {
  children: {},
};

SelectionsProvider.propTypes = {
  children: PropTypes.object,
};

export { SelectionsProvider, useSelections };
