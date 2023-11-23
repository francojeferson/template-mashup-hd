import PropTypes from "prop-types";

export default function FilterMessage({ message, absolute }) {
  const style = absolute
    ? {
        position: "absolute",
        inset: 0,
      }
    : {};
  return (
    <div className="filterMessageWrapper" style={style}>
      <div className="filterMessageCard">
        <i className="fas fa-comment-alt-exclamation" />
        <div>
          <div className="filterMessageTitle"> Filtro necessário </div>
          <div className="filterMessageText">{message}</div>
        </div>
      </div>
    </div>
  );
}

FilterMessage.defaultProps = {
  message: "",
  absolute: false,
};

FilterMessage.propTypes = {
  message: PropTypes.string,
  absolute: PropTypes.bool,
};
