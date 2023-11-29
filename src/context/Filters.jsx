import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

const FiltersContext = createContext();

function FiltersProvider({ children }) {
  const [currentPeriod, setCurrentPeriod] = useState("");

  return (
    <FiltersContext.Provider
      value={{
        currentPeriod,
        setCurrentPeriod,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

function useFilters() {
  const context = useContext(FiltersContext);

  if (!context) {
    throw new Error("useFilters should be used within a FiltersProvider");
  }

  return context;
}

FiltersProvider.defaultProps = {
  children: {},
};

FiltersProvider.propTypes = {
  children: PropTypes.object,
};

export { FiltersProvider, useFilters };
