import { createContext, useContext, useState } from "react";

import PropTypes from "prop-types";

const ModalContext = createContext();

function ModalProvider({ children }) {
  const [selections, setSelections] = useState([]);
  const [filterBarModalOpened, setFilterBarModalOpened] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        selections,
        setSelections,
        filterBarModalOpened,
        setFilterBarModalOpened,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal should be used within a SelectionsProvider");
  }

  return context;
}

ModalProvider.defaultProps = {
  children: {},
};

ModalProvider.propTypes = {
  children: PropTypes.object,
};

export { ModalProvider, useModal };
