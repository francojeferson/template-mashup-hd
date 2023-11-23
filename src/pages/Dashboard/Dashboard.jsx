import PropTypes from "prop-types";
import { useMediaQuery } from "react-responsive";
import DashboardDesktop from "./DashboardDesktop";
import DashboardMobile from "./DashboardMobile";

function Dashboard({ app, config }) {
  const isMobile = useMediaQuery({ query: "(max-width: 980px)" });

  return isMobile ? (
    <DashboardMobile app={app} config={config} />
  ) : (
    <DashboardDesktop app={app} config={config} />
  );
}

Dashboard.defaultProps = {
  app: null,
  config: {},
};

Dashboard.propTypes = {
  app: PropTypes.object,
  config: PropTypes.object,
};

export default Dashboard;
