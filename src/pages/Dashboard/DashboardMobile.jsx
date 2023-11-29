import PropTypes from "prop-types";
import Card from "../../components/Cards/Card";
import KpiCard from "../../components/KPI/KpiCard";
import NativeObject from "../../components/NativeObject/NativeObject";

function DashboardMobile({ app, config }) {
  const { container } = config.dashboard;

  return (
    <div className="app dashboard">
      <div className="appContent">
        <div style={{ display: "flex", flexWrap: "wrap" }}>
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
                customStyle={{ height: "150px" }}
                isMobile={true}
              ></KpiCard>
            );
          })}

          {container[1].cards.map((card, index) => {
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
                customStyle={{ height: "150px" }}
                isMobile={true}
              ></KpiCard>
            );
          })}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {container[2].cards.map((card, index) => {
            return (
              <Card
                expandable
                exportTable
                exportTableId={container[2].cards[1].nativeObject.id}
                header={{ hardTitle: card.title.hardTitle }}
                style={{ width: "100%", height: "250px" }}
              >
                <NativeObject
                  app={app}
                  key={index}
                  reference={{ id: card.nativeObject.id }}
                  style={{ marginTop: "10px" }}
                />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

DashboardMobile.defaultProps = {
  app: null,
  config: {},
};

DashboardMobile.propTypes = {
  app: PropTypes.object,
  config: PropTypes.object,
};

export default DashboardMobile;
