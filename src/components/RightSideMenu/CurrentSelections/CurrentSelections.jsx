import PropTypes from "prop-types";

function CurrentSelections({ app, selections }) {
  return (
    <div className="currentSelections">
      {selections.length > 0 ? (
        selections.map((item) => (
          <div className="selection" key={item.qField}>
            <div className="contentContainer">
              <span className="title">{item.qField}</span>
              <span className="selected">{item.qSelected}</span>
            </div>

            <button
              type="button"
              className="buttonClose"
              onClick={() => app.field(item.qField).clear()}
            >
              <i className="fal fa-times-circle" />
            </button>
          </div>
        ))
      ) : (
        <span>Nenhuma seleção ativa até o momento</span>
      )}
    </div>
  );
}

CurrentSelections.defaultProps = {
  app: null,
  selections: [],
};

CurrentSelections.propTypes = {
  app: PropTypes.object,
  selections: PropTypes.array,
};

export default CurrentSelections;
