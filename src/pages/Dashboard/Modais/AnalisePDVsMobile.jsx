import { Tab, Tabs, styled } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import FilterMenuModal from "../../../components/FilterMenu/FilterMenuModal";
import NativeObject from "../../../components/NativeObject/NativeObject";
import TabPanel from "../../../components/TabPanel/TabPanel";
import { useExportId } from "../../../context/ExportId";

const LayoutWrapper = styled("div")({
  alignItems: "stretch",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  justifyContent: "space-evenly",
  width: "100%",
  justifyItems: "stretch",
});
function AnalisePDVsMobile({ app, config, index }) {
  const [activeTab, setActiveTab] = useState(index);
  const { tabs } = config.overview.cards[1].modal;
  const { setExportId } = useExportId();

  const handleSecondTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    setExportId(tabs[activeTab].id);

    return () => {
      setExportId(false);
    };
  }, [activeTab]);

  return (
    <LayoutWrapper>
      <FilterMenuModal app={app} filters={config.app?.filters || {}} />
      <div style={{ display: "flex", marginBottom: "24px" }}>
        <Tabs
          className="tabsContainerMobile"
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
        </Tabs>
      </div>
      <TabPanel
        value={activeTab}
        index={0}
        style={{ width: "100%", height: "100%" }}
      >
        <NativeObject
          app={app}
          reference={{ id: tabs[0].id }}
          style={{ flex: 1, height: "100%" }}
          className="analisePDVs"
          type="table"
        />
      </TabPanel>
      <TabPanel
        value={activeTab}
        index={1}
        style={{ width: "100%", height: "100%" }}
      >
        <NativeObject
          app={app}
          reference={{ id: tabs[1].id }}
          style={{ flex: 1, height: "100%" }}
          className="analisePDVs"
          type="table"
        />
      </TabPanel>
      <TabPanel
        value={activeTab}
        index={2}
        style={{ width: "100%", height: "100%" }}
      >
        <NativeObject
          app={app}
          reference={{ id: tabs[2].id }}
          style={{ flex: 1, height: "100%" }}
          className="analisePDVs"
          type="table"
        />
      </TabPanel>
    </LayoutWrapper>
  );
}

export default AnalisePDVsMobile;

AnalisePDVsMobile.defaultProps = {
  app: null,
  config: {},
  index: 0,
};

AnalisePDVsMobile.propTypes = {
  app: PropTypes.object,
  config: PropTypes.object,
  index: PropTypes.number,
};
