import PropTypes from "prop-types";
import { useMediaQuery } from "react-responsive";
import DetailDesktop from "./DetailDesktop";
import DetailMobile from "./DetailMobile";

function Detail({ app, config, filter }) {
  const isMobile = useMediaQuery({ query: "(max-width: 980px)" });

  return isMobile ? (
    <DetailMobile app={app} config={config} filter={filter} />
  ) : (
    <DetailDesktop app={app} config={config} filter={filter} />
  );
}

Detail.defaultProps = {
  app: null,
  config: {},
  filter: "",
};

Detail.propTypes = {
  app: PropTypes.object,
  config: PropTypes.object,
  filter: PropTypes.string,
};

export default Detail;
