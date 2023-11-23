import { styled, Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import NativeFilter from "../NativeFilter/NativeFilter";
import TabPanel from "../TabPanel/TabPanel";

const LayoutWrapper = styled("div")({
  alignItems: "stretch",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  justifyContent: "space-evenly",
  width: "100%",
});
const ButtonWrapper = styled("div")({
  button: {
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #e6e6e6",
    borderRadius: "6px",
    display: "flex",
    padding: "8px 12px",
    span: {
      color: "#475257",
      fontSize: "10px",
      fontWeight: "800",
      letterSpacing: "0.15em",
      marginRight: "5px",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    },
    i: {
      color: "#475257",
      fontSize: "16px",
    },
    "&:hover": {
      backgroundColor: "#f2f4fd",
      span: { color: "#0190d2" },
      i: { color: "#0190d2" },
    },
  },
});

const LoaderWrapper = styled("div")({
  "& img": {
    maxWidth: "18px",
    maxHeight: "16px",
  },
});
function FilterContainer({ app, config, index }) {
  const [activeTab, setActiveTab] = useState(index);
  const [loadingExcel, setLoadingExcel] = useState(false);

  const tabs = config.main;
  const handleSecondTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const exportToXLS = (objectId) => {
    setLoadingExcel(false);

    if (app && objectId) {
      setLoadingExcel(true);

      app.visualization
        .get(tabs[activeTab].id)
        .then((vis) => {
          vis.exportData({ format: "CSV_T" }).then((link) => {
            setLoadingExcel(false);
            window.open(link);
          });
        })
        .catch(() => setLoadingExcel(false));
    }
  };
  return (
    <LayoutWrapper>
      {/* <FilterMenuModal app={app} filters={config.app?.filters || {}} /> */}
      <div style={{ display: "flex", marginBottom: "24px" }}>
        <Tabs
          value={activeTab}
          onChange={handleSecondTabChange}
          style={{ width: "100%", display: "inline-block" }}
        >
          <Tab
            label={tabs[0].label}
            id={`tab-${1}`}
            aria-controls={`simple-tabpanel-${0}`}
          />
          <Tab
            label={tabs[1].label}
            id={`tab-${2}`}
            aria-controls={`simple-tabpanel-${1}`}
          />
          <Tab
            label={tabs[2].label}
            id={`tab-${3}`}
            aria-controls={`simple-tabpanel-${2}`}
          />
          <Tab
            label={tabs[3].label}
            id={`tab-${4}`}
            aria-controls={`simple-tabpanel-${3}`}
          />
          <Tab
            label={tabs[4].label}
            id={`tab-${5}`}
            aria-controls={`simple-tabpanel-${4}`}
          />
          <Tab
            label={tabs[5].label}
            id={`tab-${6}`}
            aria-controls={`simple-tabpanel-${5}`}
          />
        </Tabs>
      </div>
      <TabPanel
        value={activeTab}
        index={0}
        style={{ width: "100%", height: "100%" }}
      >
        <NativeFilter
          app={app}
          reference={{ id: tabs[0].id }}
          style={{ width: "100%", height: "100%" }}
        />
      </TabPanel>
      <TabPanel
        value={activeTab}
        index={1}
        style={{ width: "100%", height: "100%" }}
      >
        <NativeFilter
          app={app}
          reference={{ id: tabs[1].id }}
          style={{ flex: 1, height: "100%" }}
        />
      </TabPanel>
      <TabPanel
        value={activeTab}
        index={2}
        style={{ width: "100%", height: "100%" }}
      >
        <NativeFilter
          app={app}
          reference={{ id: tabs[2].id }}
          style={{ flex: 1, height: "100%" }}
        />
      </TabPanel>
      <TabPanel
        value={activeTab}
        index={3}
        style={{ width: "100%", height: "100%" }}
      >
        <NativeFilter
          app={app}
          reference={{ id: tabs[3].id }}
          style={{ flex: 1, height: "100%" }}
        />
      </TabPanel>
      <TabPanel
        value={activeTab}
        index={4}
        style={{ width: "100%", height: "100%" }}
      >
        <NativeFilter
          app={app}
          reference={{ id: tabs[4].id }}
          style={{ flex: 1, height: "100%" }}
        />
      </TabPanel>
      <TabPanel
        value={activeTab}
        index={5}
        style={{ width: "100%", height: "100%" }}
      >
        <NativeFilter
          app={app}
          reference={{ id: tabs[5].id }}
          style={{ flex: 1, height: "100%" }}
        />
      </TabPanel>
    </LayoutWrapper>
  );
}

export default FilterContainer;

FilterContainer.defaultProps = {
  app: null,
  config: {},
  index: 0,
};

FilterContainer.propTypes = {
  app: PropTypes.object,
  config: PropTypes.object,
  index: PropTypes.number,
};
