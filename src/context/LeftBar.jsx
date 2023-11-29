import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

const LeftBarContext = createContext();

function LeftBarProvider({ children }) {
  const [leftBarOpened, setLeftBarOpened] = useState(window.innerWidth > 688);

  return (
    <LeftBarContext.Provider value={{ leftBarOpened, setLeftBarOpened }}>
      {children}
    </LeftBarContext.Provider>
  );
}

function useLeftBar() {
  const context = useContext(LeftBarContext);

  if (!context) {
    throw new Error("useFilterBar should be used within a LeftBarProvider");
  }

  return context;
}

LeftBarProvider.defaultProps = {
  children: {},
};

LeftBarProvider.propTypes = {
  children: PropTypes.object,
};

export { LeftBarProvider, useLeftBar };
