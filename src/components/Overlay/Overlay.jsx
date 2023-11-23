import PropTypes from "prop-types";

function Overlay({ children, onClick, backgroundColor }) {
  return (
    <div role="button" className="overlayWrapper">
      <div
        aria-label="Overlay"
        role="button"
        aria-hidden
        onClick={onClick}
        onKeyDown={onClick}
        className="overlay"
        style={{ backgroundColor: backgroundColor }}
      />
      <div className="overlayContent">{children}</div>
    </div>
  );
}

Overlay.defaultProps = {
  children: null,
  onClick: null,
  backgroundColor: null,
};

Overlay.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  backgroundColor: PropTypes.string,
};

export default Overlay;
