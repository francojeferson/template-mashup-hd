import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import engine from "../QlikEngine";

const QlikContext = createContext();

function QlikProvider({ children, config }) {
  const [qlik, setQlik] = useState(null);
  const [qlikConfig, setQlikConfig] = useState(null);
  const [actualApp, setActualApp] = useState(null);
  const [switchOnDemand, setSwitchOnDemand] = useState(false);

  useEffect(() => {
    if (config.webIntegrationId) {
      engine.connectQCS(config).then((qlikModule) => {
        setQlikConfig(config);
        setQlik(qlikModule);
        window.qlikModule = qlikModule;
      });
    } else {
      engine.connectQSE(config).then((qlikModule) => {
        setQlikConfig(config);
        setQlik(qlikModule);
      });
    }
  }, []);

  return (
    <QlikContext.Provider
      value={{
        qlik,
        qlikConfig,
        actualApp,
        setActualApp,
        switchOnDemand,
        setSwitchOnDemand,
      }}
    >
      {children}
    </QlikContext.Provider>
  );
}

function useQlik() {
  const context = useContext(QlikContext);

  if (!context) {
    throw new Error(" useQlik should be used within a QlikProvider");
  }

  return context;
}

QlikProvider.defaultProps = {
  children: {},
  config: {
    host: window.location.hostname,
    prefix: window.location.pathname.substr(
      0,
      window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1,
    ),
    port: window.location.port,
    isSecure: window.location.protocol === "https:",
  },
};

QlikProvider.propTypes = {
  children: PropTypes.object,
  config: PropTypes.object,
};

export { QlikProvider, useQlik };
