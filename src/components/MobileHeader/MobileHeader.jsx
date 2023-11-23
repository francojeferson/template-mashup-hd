import { Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

const MobileHeader = ({ tab }) => {
  const tabValue = tab || 0;
  const history = useHistory();
  const handleclick = (path) => history.push(path);

  return (
    <div className="mobileTabsHeader">
      <Tabs value={tabValue}>
        <Tab
          label="POSITIVAÇÃO"
          id={`tab-${1}`}
          aria-controls={`simple-tabpanel-${1}`}
          onClick={() => handleclick("/alavancas-de-execucao/positivacao")}
        />
        <Tab
          label="PREÇO"
          id={`tab-${2}`}
          aria-controls={`simple-tabpanel-${2}`}
          onClick={() => handleclick("/alavancas-de-execucao/preco")}
        />
        <Tab
          label="MIX IDEAL"
          id={`tab-${3}`}
          aria-controls={`simple-tabpanel-${3}`}
          onClick={() => handleclick("/alavancas-de-execucao/mixideal")}
        />
      </Tabs>
    </div>
  );
};

MobileHeader.defaultProps = {
  tab: 0,
};

MobileHeader.propTypes = {
  tab: PropTypes.number,
};

export default MobileHeader;
