import PropTypes from "prop-types";

function ObjectError({ message }) {
  return (
    <div className="objectError">
      <span>{message}</span>
    </div>
  );
}

ObjectError.defaultProps = {
  message: "",
};

ObjectError.propTypes = {
  message: PropTypes.string,
};

export default ObjectError;
