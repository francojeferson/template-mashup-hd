import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ConfigService from "../services/Config";

const ConfigContext = createContext();

const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState();
  useEffect(() => {
    if (!config) {
      ConfigService.getAllPagesConfig().then((pagesConfig) => {
        setConfig(pagesConfig);
      });
    }
  }, [config]);

  return (
    <ConfigContext.Provider value={{ config }}>
      {children}
    </ConfigContext.Provider>
  );
};
const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error(" useConfig should be used inside config context");
  }

  return context;
};

ConfigProvider.defaultProps = {
  children: {},
};

ConfigProvider.propTypes = {
  children: PropTypes.object,
};

export { ConfigProvider, useConfig };
