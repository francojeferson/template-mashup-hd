import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import echarts from "echarts";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Utils from "../../QlikUtils";
import appearance from "../Charts/Appearance";
import BarChartDataProps from "../Charts/BarChartDataProps";
import WaterfallDataProps from "../Charts/WaterFallDataProps";
import Kpi from "../KPI/Kpi";
import ObjectError from "../ObjectError/ObjectError";
import ObjectLoader from "../ObjectLoader/ObjectLoader";
import CustomRadio from "../Radio/CustomRadio";
import TabPanel from "../TabPanel/TabPanel";
import Title from "../Title/Title";
import TooltipInfo from "../TooltipInfo/TooltipInfo";

const extractChartData = (item, label, color) => {
  let finalColor = "#38BC9A";
  if (item.qAttrExps) {
    finalColor = item.qAttrExps.qValues[0].qText;
  }
  if (color) {
    finalColor = color;
  }
  return {
    value: item.qNum,
    formattedValue: item.qText,
    label: {
      normal: {
        position: Utils.getLabelPosition(item.qNum),
        color: Utils.getLabelColor(item.qNum),
      },
    },
    itemName: label,
    color: finalColor,
  };
};

const extractWaterfallData = (item, label) => ({
  value: item.qNum,
  formattedValue: item.qText,
  label: {
    normal: {
      // position: item.qNum > 0 ? 'left' : 'right',
      position: "left",
      color: "#666",
    },
  },
  itemName: label,
  color: item.qAttrExps ? item.qAttrExps.qValues[0].qText : "#38BC9A",
});

const VariacoesOverview = ({ app, config }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRadio, setSelectedRadio] = useState("Fabricante");
  const { cards } = config.overview;
  const { waterfall, barcharts1, barcharts2 } = cards[2];
  const isMounted = useRef();

  const tableIds = {
    Fabricante: "wJVYQ",
    Categoria: "meWJW",
    Marca: "EdJkbyA",
    SKU: "VQmwuqQ",
  };
  const [selectedTableId, setSelectedTableId] = useState(tableIds.Fabricante);
  const refsToClose = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 980px)" });

  useEffect(() => {
    isMounted.current = true;
    if (app) {
      setSelectedTableId(tableIds[selectedRadio]);

      return () => {
        isMounted.current = false;
        if (refsToClose.current) {
          Utils.destroyHC(
            app,
            refsToClose.current?.hypercube,
            refsToClose.current?.vis,
          );
        }
      };
    }
  }, [selectedRadio, app]);

  useEffect(() => {
    Utils.createHyperCubeByQlikIdToTable(
      app,
      selectedTableId,
      100,
      (res, vis) => {
        if (isMounted.current) {
          refsToClose.current = { hypercube: res, vis };
          if (res && res.code) {
            setError({
              message: "Could not load object",
            });
            setLoading(false);
          } else {
            const labels = [];
            const repSelloutData = [];
            const selloutCrescData = [];
            const repEstoqueData = [];
            const estoqueCrescData = [];
            const waterfallData = [];
            const matrix = res.qHyperCube.qDataPages[0].qMatrix.reverse();
            const measureInfo = res.qHyperCube.qMeasureInfo;
            const totalRow = res.qHyperCube.qGrandTotalRow;

            matrix.forEach((row) => {
              const label = row[0].qText;
              labels.push(label);
              repSelloutData.push(extractChartData(row[1], label));
              selloutCrescData.push(extractChartData(row[2], label));
              repEstoqueData.push(extractChartData(row[3], label));
              estoqueCrescData.push(extractChartData(row[4], label));
              waterfallData.push(extractWaterfallData(row[6], label));
            });

            const waterfallFirstBar = extractChartData(
              totalRow[4],
              measureInfo[4].qFallbackTitle,
              "#55B6EB",
            );
            const waterfallLasttBar = extractChartData(
              totalRow[6],
              measureInfo[6].qFallbackTitle,
              "#55B6EB",
            );
            const waterfallLabels = [...labels];
            waterfallLabels.unshift(measureInfo[4].qFallbackTitle);
            waterfallLabels.push(measureInfo[6].qFallbackTitle);
            setData([
              {
                measures: [measureInfo[0]],
                data: repSelloutData,
                labels: labels,
              },
              {
                measures: [measureInfo[1]],
                data: selloutCrescData,
                labels: labels,
              },
              {
                measures: [measureInfo[2]],
                data: repEstoqueData,
                labels: labels,
              },
              {
                measures: [measureInfo[3]],
                data: estoqueCrescData,
                labels: labels,
              },
              {
                measures: [measureInfo[6]],
                data: waterfallData,
                firstBar: waterfallFirstBar,
                lastBar: waterfallLasttBar,
                labels: waterfallLabels,
              },
            ]);
            setLoading(false);
          }
        }
      },
    );
  }, [selectedTableId, app]);

  return (
    <div className="column">
      {error ? (
        <ObjectError message={error.message} />
      ) : loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "419px",
            width: "100%",
          }}
        >
          <div className="charts-container">
            <div className="chart-container" style={{ minWidth: "350px" }}>
              <ObjectLoader icon="barchart" height="inherit" width="inherit" />
            </div>
            <div className="chart-container">
              <ObjectLoader icon="barchart" height="inherit" width="inherit" />
            </div>
            <div className="chart-container">
              <ObjectLoader icon="barchart" height="inherit" width="inherit" />
            </div>
            <div className="chart-container">
              <ObjectLoader icon="barchart" height="inherit" width="inherit" />
            </div>
            <div className="chart-container">
              <ObjectLoader icon="barchart" height="inherit" width="inherit" />
            </div>
          </div>
        </div>
      ) : (
        <div className="charts-container">
          <div className="chart-container" style={{ flex: 1 }}>
            <div className="title-container">
              <div className="chart-title">
                <Title
                  app={app}
                  reference={{
                    id: waterfall.title,
                    hardTitle: waterfall.hardTitle,
                  }}
                />
                <TooltipInfo
                  text={waterfall.tooltip}
                  style={{ marginLeft: "5px" }}
                />
              </div>
            </div>
            <CustomRadio
              onClick={(e) => setSelectedRadio(e)}
              values={[
                { id: 1, name: "Fabricante" },
                { id: 2, name: "Categoria" },
                { id: 3, name: "Marca" },
                { id: 4, name: "SKU" },
              ]}
              initialActive={selectedRadio}
              containerStyle={{ marginBottom: "19px" }}
            />
            <WaterfallDataProps
              measures={data[4].measures}
              data={data[4].data}
              labels={data[4].labels}
              firstBar={data[4].firstBar}
              lastBar={data[4].lastBar}
              style={{
                height: "100%",
                flex: "1",
                minHeight: "250px",
              }}
              echarts={echarts}
              group="overviewBottomCard"
              options={appearance.waterfall("waterfallOverview")}
            />
          </div>
          <div className="chart-container" style={{ flex: 1 }}>
            <div className="title-container">
              <div className="chart-title paddingLeft">
                <Title
                  app={app}
                  reference={{
                    id: barcharts1.title,
                    hardTitle: barcharts1.hardTitle,
                  }}
                />
                <TooltipInfo
                  text={barcharts1.tooltip}
                  style={{ marginLeft: "5px" }}
                />
              </div>
            </div>
            <div className="chart-container row">
              <div className="chart-container" style={{ flex: 1 }}>
                {isMobile ? (
                  <VariacaoIndividual app={app} data={data} />
                ) : (
                  <>
                    <Kpi
                      app={app}
                      reference={{ id: "hpmQJJ" }}
                      loaderHeight="44px"
                    />
                    <BarChartDataProps
                      waterfallConnected
                      measures={data[0].measures}
                      data={data[0].data}
                      labels={data[0].labels}
                      style={{
                        height: "100%",
                        flex: "1",
                      }}
                      options={appearance.barchart("HorizontalProps")}
                      echarts={echarts}
                      group="overviewBottomCard"
                    />
                  </>
                )}
              </div>
              {isMobile ? (
                ""
              ) : (
                <div className="chart-container">
                  <Kpi
                    app={app}
                    reference={{ id: "QfpWj" }}
                    loaderHeight="44px"
                  />
                  <BarChartDataProps
                    waterfallConnected
                    measures={data[1].measures}
                    data={data[1].data}
                    labels={data[1].labels}
                    style={{ height: "100%", flex: "1" }}
                    options={appearance.barchart("HorizontalProps")}
                    echarts={echarts}
                    group="overviewBottomCard"
                  />
                </div>
              )}
            </div>
          </div>

          {/* end */}
          <div className="chart-container">
            <div className="title-container">
              <div className="chart-title paddingLeft">
                <Title
                  app={app}
                  reference={{
                    id: barcharts2.title,
                    hardTitle: barcharts2.hardTitle,
                  }}
                />
                <TooltipInfo
                  text={barcharts2.tooltip}
                  style={{ marginLeft: "5px" }}
                />
              </div>
            </div>
            <div className="chart-container row">
              <div className="chart-container">
                {isMobile ? (
                  <VariacaoEstoque app={app} data={data} />
                ) : (
                  <>
                    <Kpi
                      app={app}
                      reference={{ id: "HRmfCP" }}
                      loaderHeight="44px"
                    />
                    <BarChartDataProps
                      waterfallConnected
                      measures={data[2].measures}
                      data={data[2].data}
                      labels={data[2].labels}
                      style={{
                        height: "100%",
                        flex: "1",
                      }}
                      options={appearance.barchart("HorizontalProps")}
                      echarts={echarts}
                      group="overviewBottomCard"
                    />
                  </>
                )}
              </div>

              {isMobile ? (
                ""
              ) : (
                <div className="chart-container">
                  <Kpi
                    app={app}
                    reference={{ id: "dxZLQ" }}
                    loaderHeight="44px"
                  />
                  <BarChartDataProps
                    waterfallConnected
                    measures={data[3].measures}
                    data={data[3].data}
                    labels={data[3].labels}
                    style={{ height: "100%", flex: "1" }}
                    options={appearance.barchart("HorizontalProps")}
                    echarts={echarts}
                    group="overviewBottomCard"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

VariacoesOverview.defaultProps = {
  app: null,
  config: {},
};

VariacoesOverview.propTypes = {
  app: PropTypes.object,
  config: PropTypes.object,
};

export default VariacoesOverview;

const VariacaoIndividual = ({ app, data }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (e, newData) => {
    setActiveTab(newData);
  };

  return (
    <>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab
          label="REP.% SELLOUT"
          id={`tab-${1}`}
          aria-controls={`simple-tabpanel-${1}`}
        />
        <Tab
          label="% CRESC"
          id={`tab-${2}`}
          aria-controls={`simple-tabpanel-${2}`}
        />
      </Tabs>
      <TabPanel value={activeTab} index={0}>
        <>
          <Kpi app={app} reference={{ id: "hpmQJJ" }} loaderHeight="44px" />
          <BarChartDataProps
            waterfallConnected
            measures={data[0].measures}
            data={data[0].data}
            labels={data[0].labels}
            style={{ height: "270px", flex: "1" }}
            options={appearance.barchart("HorizontalProps")}
            echarts={echarts}
            group="overviewBottomCard"
          />
        </>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <>
          <Kpi app={app} reference={{ id: "QfpWj" }} loaderHeight="44px" />
          <BarChartDataProps
            waterfallConnected
            measures={data[1].measures}
            data={data[1].data}
            labels={data[1].labels}
            style={{ height: "270px", flex: "1" }}
            options={appearance.barchart("HorizontalProps")}
            echarts={echarts}
            group="overviewBottomCard"
          />
        </>
      </TabPanel>
    </>
  );
};

VariacaoIndividual.defaultProps = {
  app: null,
  data: [],
};

VariacaoIndividual.propTypes = {
  app: PropTypes.object,
  data: PropTypes.array,
};

const VariacaoEstoque = ({ app, data }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (e, newData) => {
    setActiveTab(newData);
  };

  return (
    <>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab
          label="REP.% ESTOQUE"
          id={`tab-${1}`}
          aria-controls={`simple-tabpanel-${1}`}
        />
        <Tab
          label="% CRESC"
          id={`tab-${2}`}
          aria-controls={`simple-tabpanel-${2}`}
        />
      </Tabs>
      <TabPanel value={activeTab} index={0}>
        <>
          <Kpi app={app} reference={{ id: "HRmfCP" }} loaderHeight="44px" />
          <BarChartDataProps
            waterfallConnected
            measures={data[2].measures}
            data={data[2].data}
            labels={data[2].labels}
            style={{ height: "270px", flex: "1" }}
            options={appearance.barchart("HorizontalProps")}
            echarts={echarts}
            group="overviewBottomCard"
          />
        </>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <Kpi app={app} reference={{ id: "dxZLQ" }} loaderHeight="44px" />
        <BarChartDataProps
          waterfallConnected
          measures={data[3].measures}
          data={data[3].data}
          labels={data[3].labels}
          style={{ height: "270px", flex: "1" }}
          options={appearance.barchart("HorizontalProps")}
          echarts={echarts}
          group="overviewBottomCard"
        />
      </TabPanel>
    </>
  );
};

VariacaoEstoque.defaultProps = {
  app: null,
  data: [],
};

VariacaoEstoque.propTypes = {
  app: PropTypes.object,
  data: PropTypes.array,
};
