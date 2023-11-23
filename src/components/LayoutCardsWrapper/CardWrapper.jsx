import PropTypes from "prop-types";

function CardWrapper({ children, customStyle }) {
  return (
    <div
      style={{
        borderRadius: "16px",
        display: "flex",
        width: "100%",
        paddingRight: "10px",
        marginBottom: "20px",
        ...customStyle,
      }}
    >
      {children}
    </div>
  );
}

CardWrapper.defaultProps = {
  children: null,
  customStyle: null,
};

CardWrapper.propTypes = {
  children: PropTypes.any,
  customStyle: PropTypes.object,
};

export default CardWrapper;
