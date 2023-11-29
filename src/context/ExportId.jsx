import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

const ExportIdContext = createContext();

function ExportIdProvider({ children }) {
  const [exportId, setExportId] = useState(false);

  return (
    <ExportIdContext.Provider value={{ exportId, setExportId }}>
      {children}
    </ExportIdContext.Provider>
  );
}

function useExportId() {
  const context = useContext(ExportIdContext);

  if (!context) {
    throw new Error("useExportId should be used within a ExportIdProvider");
  }

  return context;
}

ExportIdProvider.defaultProps = {
  children: {},
};

ExportIdProvider.propTypes = {
  children: PropTypes.object,
};

export { ExportIdProvider, useExportId };
