import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

const FilterBarContext = createContext();

function FilterBarProvider({ children }) {
  const [filterBarOpened, setFilterBarOpened] = useState(false);

  return (
    <FilterBarContext.Provider
      value={{
        filterBarOpened,
        setFilterBarOpened,
      }}
    >
      {children}
    </FilterBarContext.Provider>
  );
}

function useFilterBar() {
  const context = useContext(FilterBarContext);

  if (!context) {
    throw new Error("useFilterBar should be used within a FilterBarProvider");
  }

  return context;
}

FilterBarProvider.defaultProps = {
  children: {},
};

FilterBarProvider.propTypes = {
  children: PropTypes.object,
};

export { FilterBarProvider, useFilterBar };
