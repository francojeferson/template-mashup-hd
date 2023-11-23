import { styled, Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import FilterMenuModal from "../../../components/FilterMenu/FilterMenuModal";
import CircleLoader from "../../../components/Loaders/CircleLoader";
import NativeObject from "../../../components/NativeObject/NativeObject";
import TabPanel from "../../../components/TabPanel/TabPanel";

const LayoutWrapper = styled("div")({
  alignItems: "stretch",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  justifyContent: "space-evenly",
  width: "100%",
  justifyItems: "stretch",
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
function AnalisePDVs({ app, config, index }) {
  const [activeTab, setActiveTab] = useState(index);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const { tabs } = config.overview.cards[1].modal;
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
      <FilterMenuModal app={app} filters={config.app?.filters || {}} />
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
        </Tabs>

        <ButtonWrapper>
          <button
            type="button"
            onClick={() => exportToXLS("471147b3-dd41-4406-b632-49e5f737fc4b")}
          >
            <span>EXPORTAR PARA EXCEL</span>
            {!loadingExcel ? (
              <i className="far fa-file-export" />
            ) : (
              <LoaderWrapper>
                <CircleLoader />
              </LoaderWrapper>
            )}
          </button>
        </ButtonWrapper>
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

export default AnalisePDVs;

AnalisePDVs.defaultProps = {
  app: null,
  config: {},
  index: 0,
};

AnalisePDVs.propTypes = {
  app: PropTypes.object,
  config: PropTypes.object,
  index: PropTypes.number,
};
