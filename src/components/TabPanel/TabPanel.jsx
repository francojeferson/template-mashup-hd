import { styled } from "@mui/material";
import PropTypes from "prop-types";

function TabPanel({ children, value, index, style }) {
  const ChildrenWrapper = styled("div")({
    display: "flex",
    width: "100%",
    height: "100%",
    ...style,
  });
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: "100%" }}
      className="tabPanelWrapper"
    >
      {value === index && (
        <ChildrenWrapper className="childrenWrapper">
          {children}
        </ChildrenWrapper>
      )}
    </div>
  );
}

TabPanel.defaultProps = {
  value: 0,
  index: 0,
  style: {},
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.number,
  index: PropTypes.number,
  style: PropTypes.object,
};

export default TabPanel;
