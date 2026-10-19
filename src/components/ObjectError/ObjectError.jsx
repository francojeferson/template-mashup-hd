import PropTypes from "prop-types";

function ObjectError({ message = "" }) {
  return (
    <div className="objectError">
      <span>{message}</span>
    </div>
  );
}

ObjectError.propTypes = {
  message: PropTypes.string,
};

export default ObjectError;
