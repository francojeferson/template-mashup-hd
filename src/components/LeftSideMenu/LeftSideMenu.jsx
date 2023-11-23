import PropTypes from "prop-types";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useLeftBar } from "../../context/LeftBar";

import utils from "../../QlikUtils";
import NavItem from "./MenuItem/NavItem";

function LeftSideMenu({ app, config, logo }) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [dataAtualizacao, setDataAtualizacao] = useState("24/10/2023");
  const screenBreakpoint = 500;

  const { t, i18n } = useTranslation();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const changeLanguage = async (tempApp, language) => {
    localStorage.setItem("language", language);
    i18n.changeLanguage(language);
    await tempApp
      .field(config.app.langVar)
      .selectMatch(utils.languageHandleQVF(language));
  };

  async function initialSelecao() {
    await app.variable.getContent("vAtualizacao", (reply) => {
      const data = reply.qContent.qString;
      setDataAtualizacao(data);
    });
  }

  useLayoutEffect(() => {
    let language = params.get("lang");
    if (!language) {
      language = localStorage.getItem("language");
    }
    language = utils.guardLanguage(language);
    changeLanguage(app, language);
  }, []);

  useEffect(() => {
    initialSelecao();
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));

    return () => {
      window.removeEventListener("resize", () =>
        setScreenWidth(window.innerWidth),
      );
    };
  }, []);

  const { leftBarOpened, setLeftBarOpened } = useLeftBar();
  return (
    <div className={leftBarOpened ? "leftSideMenu is-opened" : "leftSideMenu"}>
      <div className="leftSideHeader">
        <div className={leftBarOpened ? "logo" : "logo is-hidden"}>
          <img
            style={{ width: "160px", height: "60px" }}
            src={logo}
            alt="logo"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setLeftBarOpened(!leftBarOpened);
          }}
          className={leftBarOpened ? "" : "align-left"}
        >
          <i
            className={
              leftBarOpened
                ? "fal fa-arrow-left close-desktop"
                : "fal fa-arrow-right"
            }
          />
          <i className={leftBarOpened ? "fal fa-times close-mobile" : ""} />
        </button>
      </div>
      <div>&nbsp;</div>

      {leftBarOpened && (
        <>
          <div className="info-client">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                paddingLeft: "10px",
                justifyContent: "start",
              }}
            >
              <h2 style={{ color: "#fff" }}>Pernod</h2>
            </div>
          </div>
          <div
            style={{
              boxShadow: "inset 0 -1px 0 #184952",
              width: "100%",
            }}
          >
            &nbsp;
          </div>
        </>
      )}

      <div className="leftSideContent">
        <ul>
          <NavItem
            icon="fas fa-chart-pie"
            name="Acuracidade"
            path="/dashboard"
          />
        </ul>
        {leftBarOpened && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              paddingLeft: "10px",
              color: "white",
              justifyContent: "start",
              marginTop: "20px",
            }}
          >
            <h4>Atualizado em: {dataAtualizacao} </h4>
          </div>
        )}
      </div>
    </div>
  );
}

LeftSideMenu.defaultProps = {
  logo: "",
};

LeftSideMenu.propTypes = {
  logo: PropTypes.string,
};

export default LeftSideMenu;
