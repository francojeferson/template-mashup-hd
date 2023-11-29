import { Skeleton as SkeletonMui, styled } from "@mui/material";
import PropTypes from "prop-types";

const Skeleton = styled(SkeletonMui)({
  borderRadius: "4px",
  backgroundColor: "#F2F4FD",
  margin: "0 2px 2px 0",
});

const Wrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  position: "relative",
});

const Row = styled("div")({
  display: "flex",
  flexDirection: "row",
});

const SkeletonsRow = () => (
  <Row>
    <Skeleton animation="wave" variant="rect" width="100%" height="28px" />
    <Skeleton animation="wave" variant="rect" width="100%" height="28px" />
    <Skeleton animation="wave" variant="rect" width="100%" height="28px" />
    <Skeleton animation="wave" variant="rect" width="100%" height="28px" />
  </Row>
);

const TableSkeleton = ({ children }) => (
  <Wrapper>
    {[1, 2, 3, 4, 5].map((_, index) => (
      <SkeletonsRow key={`tableSkeleton-${index}-${_}`} />
    ))}
    {children}
  </Wrapper>
);

TableSkeleton.defaultProps = {
  children: {},
};

TableSkeleton.propTypes = {
  children: PropTypes.node,
};

export default TableSkeleton;
