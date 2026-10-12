import PropTypes from "prop-types";

function LayoutCardsWrapper({ children = null }) {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-evenly",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}

LayoutCardsWrapper.propTypes = {
  children: PropTypes.any,
};

export default LayoutCardsWrapper;
