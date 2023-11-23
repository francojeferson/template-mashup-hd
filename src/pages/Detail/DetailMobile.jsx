import PropTypes from "prop-types";
import Card from "../../components/Cards/Card";
import NativeObject from "../../components/NativeObject/NativeObject";

function DetailMobile({ app, config }) {
  const { container } = config.detail;
  const { title } = container[0].cards[0];

  return (
    <div className="app detail">
      <div className="appContent">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            height: "100%",
            paddingBottom: "20px",
          }}
        >
          <Card
            exportTable
            app={app}
            exportContainer
            exportTableId={container[0].cards[0].nativeObject[0].id}
            header={{
              hardTitle: title.hardTitle,
            }}
            style={{
              width: "100%",
              alignItems: "center",
              height: "100%",
            }}
          >
            <NativeObject
              app={app}
              key={container[0].cards[0].nativeObject[0].id}
              reference={{
                id: container[0].cards[0].nativeObject[0].id,
              }}
              style={{ marginTop: "20px" }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

DetailMobile.defaultProps = {
  app: null,
  config: {},
};

DetailMobile.propTypes = {
  app: PropTypes.object,
  config: PropTypes.object,
};

export default DetailMobile;
