import { Suspense, useEffect, useState } from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";

// HOOKS
import { useConfig } from "../context/Config";
import { useFilterBar } from "../context/FilterBar";
import { useLeftBar } from "../context/LeftBar";
import { useQlik } from "../context/Qlik";

// PAGES
import Dashboard from "./Dashboard/Dashboard";
import Detail from "./Detail/Detail";

// COMPONENTS
import AppLoader from "../components/AppLoader/AppLoader";
import FilterMenu from "../components/FilterMenuNative/FilterMenu";
import Header from "../components/Header/Header";
import LeftSideMenu from "../components/LeftSideMenu/LeftSideMenu";

// ASSETS
import { I18nextProvider } from "react-i18next";
import logo from "../assets/icons/logo.svg";
import MiddlewareRoute from "../components/MiddlewareRoute";
import i18n from "../i18n";
import "../style.scss";
import Auth from "./auth";
import Logout from "./auth/Logout";

function LayoutPage() {
  const { qlik, qlikConfig, setActualApp, switchOnDemand } = useQlik();
  const { filterBarOpened } = useFilterBar();
  const { leftBarOpened } = useLeftBar();
  const { config } = useConfig();
  const [app, setApp] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isA, setIsA] = useState(switchOnDemand);
  // App OnDemand
  const [appOnDemand, setAppOnDemand] = useState();

  useEffect(() => {
    if (qlik) {
      setIsLoading(false);
      const qvfId = process.env.REACT_APP_QVF_ID;
      const tempApp = qlik.openApp(qvfId, qlikConfig);
      window.app = tempApp;
      setApp(tempApp);
      setActualApp(tempApp);

      // Config App OnDemand
    }
  }, [qlik]);

  useEffect(() => {
    if (qlik) setTimeout(qlik.resize, 500);
  }, [filterBarOpened, leftBarOpened]);

  useEffect(() => {
    console.log("Proxima rota", switchOnDemand);
    setIsA(switchOnDemand);
  }, [switchOnDemand]);

  return isLoading ? (
    <AppLoader />
  ) : (
    <div
      style={{ left: leftBarOpened && "224px" }}
      className={filterBarOpened ? "appWrapper is-right-opened" : "appWrapper"}
    >
      <div id="expandedWrapper" />
      <HashRouter>
        <LeftSideMenu app={app} config={config} logo={logo} />
        <Header />
        <FilterMenu app={app} filters={config.app?.filters || {}} />
        <Switch>
          <Route path="/auth" render={() => <Auth />} />
          <Route path="/redirect" render={() => <Logout />} />
          <Route
            path="/logout"
            render={() => <MiddlewareRoute component={<Logout />} publico />}
          />
          <Route
            path="/dashboard"
            exact
            render={() => (
              <MiddlewareRoute
                component={<Dashboard app={app} config={config} />}
                container
              />
            )}
          />
          <Route exact path="/">
            <Redirect to="/dashboard" />
          </Route>
          <Route
            path="/detail"
            exact
            render={() => (
              <MiddlewareRoute
                component={<Detail app={app} config={config} />}
                container
              />
            )}
          />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default function Layout() {
  return (
    <Suspense fallback={<AppLoader />}>
      <I18nextProvider i18n={i18n}>
        <LayoutPage />
      </I18nextProvider>
    </Suspense>
  );
}
