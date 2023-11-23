import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import ThumbTackCheck from "../../assets/icons/Dashboard/thumbtakCheck.svg";
import ThumbTackUnChecked from "../../assets/icons/Dashboard/thumbtakUnChecked.svg";
import ComboHeader from "../../components/ComboHeader/ComboHeader";
import NativeObject from "../../components/NativeObject/NativeObject";
import Card from "../Cards/Card";

function KpiCard({
  app,
  KPITitle,
  iconId,
  percentageId,
  greyValueId,
  valueId,
  customStyle,
  isMobile,
  selectedCheck,
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCheck) {
      console.log("selected", selectedCheck);
    }
  }, [selectedCheck]);

  useEffect(() => {
    if (KPITitle) {
      setLoading(false);
    }
  }, [KPITitle]);
  return (
    <Card
      style={{
        width: "100%",
        padding: "10px",
        justifyContent: "center",
        ...customStyle,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "30px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ paddingLeft: "8px" }}>
          <img
            src={
              selectedCheck === KPITitle.hardTitle
                ? ThumbTackCheck
                : ThumbTackUnChecked
            }
            alt="pino fixado"
            style={{ width: "32px", height: "32px" }}
          />
        </div>
        <div
          style={{
            width: "70%",
            height: "100%",
            paddingTop: "4px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {/* TITULO */}
          <ComboHeader
            reference={{
              title: {
                id: KPITitle.id,
                hard: KPITitle.hardTitle,
              },
            }}
            classStyle="combo-header-kpi"
          />
        </div>

        <div
          style={{
            width: "30%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {/* INDICADOR PORCENTAGEM */}
          <NativeObject
            app={app}
            key={percentageId}
            reference={{ id: percentageId }}
          />
        </div>
      </div>

      <div
        style={{
          height: "100%",
          width: isMobile ? null : "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: isMobile ? null : "center",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: isMobile ? null : "start",
          }}
        >
          {/*CONTAINER ICON*/}
          <div
            style={{
              width: isMobile ? "10%" : "25%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* ICON*/}
            <div
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                display: "flex",
                justifyContent: "start",
              }}
            >
              <img
                src={`./assets/icons/Dashboard/${iconId}.svg`}
                style={{ width: "46px", height: "46px" }}
              ></img>
            </div>
          </div>

          {/*CONTAINER VALUES*/}
          <div
            style={{
              width: isMobile ? "90%" : "75%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {greyValueId && (
              <div className="containerKpiValueGrey">
                {/* VALOR EM CINZA */}
                <NativeObject
                  className="kpiValueGrey"
                  app={app}
                  key={greyValueId}
                  reference={{ id: greyValueId }}
                />
              </div>
            )}
            <div
              className={
                greyValueId
                  ? "containerKpiValueBold"
                  : "containerKpiValueBoldUnique"
              }
            >
              {/* VALOR PRINCIPAL */}
              <NativeObject
                className="kpiValueBold"
                app={app}
                key={valueId}
                reference={{ id: valueId }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

KpiCard.defaultProps = {
  app: null,
  KPITitle: {},
  iconId: null,
  percentageId: null,
  greyValueId: null,
  valueId: null,
  selectedCheck: "",
};

KpiCard.propTypes = {
  app: PropTypes.object,
  KPITitle: PropTypes.object,
  iconId: PropTypes.string,
  percentageId: PropTypes.string,
  greyValueId: PropTypes.string,
  valueId: PropTypes.string,
  selectedCheck: PropTypes.string,
};

export default KpiCard;
