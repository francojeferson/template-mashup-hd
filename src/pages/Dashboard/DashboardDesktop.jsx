import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Card from "../../components/Cards/Card";
import ComboHeader from "../../components/ComboHeader/ComboHeader";
import KpiCard from "../../components/KPI/KpiCard";
import CardWrapper from "../../components/LayoutCardsWrapper/CardWrapper";
import LayoutCardsWrapper from "../../components/LayoutCardsWrapper/LayoutCardsWrapper";
import NativeObject from "../../components/NativeObject/NativeObject";
import { useQlik } from "../../context/Qlik";

function DashboardDesktop({ app, config }) {
  const { setSwitchOnDemand } = useQlik();
  const { container } = config.dashboard;

  const [selectPeriodo, setSelectPeriodo] = useState("");
  const [selectTipoSelecao, setSelectTipoSelecao] = useState("");

  const initializeField = () => {
    const dataPeriodo = app.field("%DC_Periodo").getData();
    dataPeriodo.OnData.bind(function () {
      var activeRow = dataPeriodo.rows.filter((row) => row.qState === "S");
      if (activeRow.length > 0) {
        setSelectPeriodo(activeRow[0].qText);
      }
    });
    const dataTipoSelecao = app.field("%TipoVisao").getData();
    dataTipoSelecao.OnData.bind(function () {
      var activeRow = dataTipoSelecao.rows.filter((row) => row.qState === "S");
      if (activeRow.length > 0) {
        setSelectTipoSelecao(activeRow[0].qText);
      }
    });
  };

  useEffect(() => {
    if (app) {
      initializeField();
    }
  }, [app]);

  return (
    <div className="app dashboard">
      <div className="appContent">
        <LayoutCardsWrapper>
          {/* KPIs */}
          <div
            style={{
              width: "100%",
              paddingInline: "10px",
              paddingTop: "8px",
            }}
          >
            <ComboHeader
              app={app}
              reference={{ title: { hard: container[0].name } }}
              radio={{
                field: { ...container[0].customRadio },
              }}
            ></ComboHeader>
          </div>

          <CardWrapper customStyle={{ height: "15%" }}>
            {container[0].cards.map((card, index) => {
              return (
                <KpiCard
                  key={index}
                  app={app}
                  KPITitle={{
                    id: card.title.id,
                    hardTitle: card.title.hardTitle,
                  }}
                  iconId={card.nativeObject.iconId}
                  percentageId={card.nativeObject.percentageId}
                  greyValueId={card.nativeObject.greyValueId}
                  valueId={card.nativeObject.valueId}
                  customStyle={{ height: "100%" }}
                  isMobile={false}
                  selectedCheck={selectPeriodo}
                ></KpiCard>
              );
            })}
          </CardWrapper>

          {/* Diferença Acumulada */}
          <div style={{ width: "100%", paddingInline: "10px" }}>
            <ComboHeader
              reference={{ title: { hard: container[1].name } }}
            ></ComboHeader>
          </div>

          <CardWrapper customStyle={{ height: "25%" }}>
            <KpiCard
              key={container[1].cards[0].nativeObject.valueId}
              app={app}
              KPITitle={{
                id: container[1].cards[0].title.id,
                hardTitle: container[1].cards[0].title.hardTitle,
              }}
              iconId={container[1].cards[0].nativeObject.iconId}
              percentageId={container[1].cards[0].nativeObject.percentageId}
              greyValueId={container[1].cards[0].nativeObject.greyValueId}
              valueId={container[1].cards[0].nativeObject.valueId}
              customStyle={{ height: "100%", width: "32.1%" }}
              isMobile={false}
            ></KpiCard>

            <Card
              expandable
              exportTable
              exportTableId={container[1].cards[1].nativeObject.id}
              header={{
                hardTitle: container[1].cards[1].title.hardTitle,
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <NativeObject
                app={app}
                key={container[1].cards[1].nativeObject.valueId}
                reference={{
                  id: container[1].cards[1].nativeObject.id,
                }}
              />
            </Card>
          </CardWrapper>

          {/* Comportamento MTD  */}
          <div style={{ width: "100%", paddingInline: "10px" }}>
            <ComboHeader
              app={app}
              reference={{ title: { hard: container[2].name } }}
              radio={{
                field: container[2].customRadio,
              }}
            ></ComboHeader>
          </div>

          <CardWrapper customStyle={{ height: "60%" }}>
            <Card
              expandable
              exportTable
              exportTableId={container[2].cards[1].nativeObject.id}
              style={{ width: "100%", height: "100%" }}
            >
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "30%", height: "100%" }}>
                  <NativeObject
                    app={app}
                    key={"indexs"}
                    reference={{ id: "xdZmzF" }}
                    style={{ marginTop: "0px" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "70%",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                      height: "100%",
                    }}
                  >
                    <ComboHeader
                      app={app}
                      reference={{
                        title: {
                          hard: "Top 5 - " + selectTipoSelecao,
                        },
                      }}
                    ></ComboHeader>
                    <NativeObject
                      app={app}
                      key={"indexgs"}
                      reference={{ id: "kmPwcPu" }}
                      style={{
                        marginTop: "10px",
                        width: "100%",
                        height: "90%",
                      }}
                      className="analisePDVs"
                      type="table"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                      height: "100%",
                    }}
                  >
                    <ComboHeader
                      app={app}
                      reference={{
                        title: {
                          hard: "Botton 5 - " + selectTipoSelecao,
                        },
                      }}
                    ></ComboHeader>
                    <NativeObject
                      app={app}
                      key={"indexgs"}
                      reference={{ id: "aVjhLT" }}
                      style={{
                        marginTop: "10px",
                        width: "100%",
                        height: "90%",
                      }}
                      className="analisePDVs"
                      type="table"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </CardWrapper>
        </LayoutCardsWrapper>
      </div>
    </div>
  );
}

DashboardDesktop.defaultProps = {
  app: null,
  config: {},
};

DashboardDesktop.propTypes = {
  app: PropTypes.object,
  config: PropTypes.object,
};

export default DashboardDesktop;
