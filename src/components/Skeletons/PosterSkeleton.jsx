import { Skeleton, styled } from "@mui/material";
import PropTypes from "prop-types";

const SkeletonS = styled(Skeleton)({
  borderRadius: "6px",
  backgroundColor: "#F2F4FD",
});

const SkeletonsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  minHeight: "180px",
  width: "100%",
  border: "1px solid #F2F4FD",
  justifyContent: "space-between",
  borderRadius: "10px",
  backgroundColor: "#Fff",
  padding: "24px",
  "&:nth-child(1), &:nth-child(2)": {
    marginRight: "20px",
  },
});

const SkeletonsWrapper = styled("div")({
  display: "flex",
  flexDirection: "row",
  position: "relative",
});

const SkeletonsRow = styled("div")({
  display: "flex",
  flexDirection: "row",
});

const Poster = () => (
  <SkeletonsContainer>
    <SkeletonS animation="wave" variant="rect" height="24px" />
    <SkeletonS animation="wave" variant="rect" height="16px" />
    <SkeletonsRow>
      <SkeletonS
        animation="wave"
        variant="rect"
        width="100%"
        height="32px"
        sx={{ marginRight: "10px" }}
      />
      <SkeletonS animation="wave" variant="rect" width="100%" height="32px" />
    </SkeletonsRow>
    <SkeletonsRow>
      <SkeletonS
        animation="wave"
        variant="rect"
        width="100%"
        height="32px"
        sx={{ marginRight: "10px" }}
      />
      <SkeletonS animation="wave" variant="rect" width="100%" height="32px" />
    </SkeletonsRow>
  </SkeletonsContainer>
);

const PosterSkeleton = ({ children, isMobile }) => {
  const quantity = isMobile ? [1] : [1, 2, 3];
  return (
    <SkeletonsWrapper>
      {quantity.map((_, index) => (
        <Poster key={`poster-${index}`} />
      ))}

      {children}
    </SkeletonsWrapper>
  );
};

PosterSkeleton.defaultProps = {
  children: {},
  isMobile: false,
};

PosterSkeleton.propTypes = {
  children: PropTypes.node,
  isMobile: PropTypes.bool,
};

export default PosterSkeleton;
