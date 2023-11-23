import { Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { useMediaQuery } from "react-responsive";

function TooltipInfo({ text, style }) {
  const isMobile = useMediaQuery({ query: "(max-width: 980px)" });

  return !isMobile ? (
    <Tooltip
      arrow
      title={text}
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: "#262626",
            borderRadius: "6px",
            fontFamily: "Public Sans",
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: "16px",
            verticalAlign: "middle",
            margin: "8px 6px",
            textAlign: "center",
          },
        },
        arrow: {
          sx: {
            color: "#262626",
          },
        },
      }}
    >
      <i className="far fa-info-circle tooltip-icon" style={{ ...style }} />
    </Tooltip>
  ) : (
    <>
      <Tooltip
        arrow
        title={text}
        enterTouchDelay={0}
        leaveTouchDelay={2000}
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: "#262626",
              borderRadius: "6px",
              fontFamily: "Public Sans",
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: "16px",
              verticalAlign: "middle",
              margin: "8px 6px",
              textAlign: "center",
            },
          },
          arrow: {
            sx: {
              color: "#262626",
            },
          },
        }}
      >
        <i className="far fa-info-circle tooltip-icon" style={{ ...style }} />
      </Tooltip>
    </>
  );
}

TooltipInfo.defaultProps = {
  text: "",
  style: {},
};

TooltipInfo.propTypes = {
  text: PropTypes.string,
  style: PropTypes.object,
};

export default TooltipInfo;
