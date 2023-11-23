import { Skeleton as SkeletonMui, styled } from "@mui/material";
import PropTypes from "prop-types";

const Skeleton = styled(SkeletonMui)({
  borderRadius: "4px",
  backgroundColor: "#F2F4FD",
});

const Wrapper = styled("div")({
  display: "flex",
  flexDirection: "row",
  position: "relative",
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
});

const BarsWrapper = styled("div")({
  display: "flex",
  flexDirection: "row",
  position: "relative",
  alignItems: "self-end",
  padding: "20px",
  width: "340px",
  justifyContent: "space-between",
});

const ChartSkeleton = ({ children }) => (
  <Wrapper>
    <BarsWrapper>
      {[93, 140, 80, 21, 160, 140].map((height, index) => (
        <Skeleton
          animation="wave"
          variant="rect"
          width="30px"
          height={height}
          key={`skeletonChart-${index}`}
        />
      ))}
    </BarsWrapper>
    {children}
  </Wrapper>
);

ChartSkeleton.defaultProps = {
  children: {},
};

ChartSkeleton.propTypes = {
  children: PropTypes.node,
};

export default ChartSkeleton;
