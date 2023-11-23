import PropTypes from "prop-types";
import { useEffect } from "react";
import Card from "../../components/Cards/Card";
import CardWrapper from "../../components/LayoutCardsWrapper/CardWrapper";
import LayoutCardsWrapper from "../../components/LayoutCardsWrapper/LayoutCardsWrapper";
import NativeObject from "../../components/NativeObject/NativeObject";
import { useQlik } from "../../context/Qlik";

function DetailDesktop({ app, config }) {
  const { container } = config.detail;
  const { title, nativeObject } = container[0].cards[0];
  const { setSwitchOnDemand } = useQlik();

  useEffect(() => {
    setSwitchOnDemand(false);
  }, [setSwitchOnDemand]);

  return (
    <div className="app detail">
      <div className="appContent">
        <LayoutCardsWrapper>
          <CardWrapper customStyle={{ height: "100%" }}>
            <Card
              exportTable
              app={app}
              exportContainer
              exportTableId={nativeObject[0].id}
              header={{
                hardTitle: title.hardTitle,
              }}
              style={{ width: "100%", alignItems: "center" }}
            >
              <NativeObject
                app={app}
                key={nativeObject[0].id}
                reference={{ id: nativeObject[0].id }}
                style={{ marginTop: "20px" }}
              />
            </Card>
          </CardWrapper>
          {/* KAPI E GRAFICO CENTRAL */}
        </LayoutCardsWrapper>
      </div>
    </div>
  );
}

DetailDesktop.defaultProps = {
  app: null,
  config: {},
};

DetailDesktop.propTypes = {
  app: PropTypes.object,
  config: PropTypes.object,
};

export default DetailDesktop;
