import PropTypes from "prop-types";

function Button({
  children = "",
  className = "",
  icon = "",
  onClick = null,
  style = null,
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`button ${className}`}
      style={style}
    >
      {icon && <i className={`far ${icon}`} />}
      {children}
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.string,
};

export default Button;
