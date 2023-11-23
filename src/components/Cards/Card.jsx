import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import PropTypes from "prop-types";
import ReactDom from "react-dom";
import ComboHeader from "../ComboHeader/ComboHeader";
import CircleLoader from "../Loaders/CircleLoader";

const ButtonWrapper = styled("div")({
  button: {
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #e6e6e6",
    borderRadius: "6px",
    display: "flex",
    padding: "8px 12px",
    marginRight: "8px",
    span: {
      color: "#475257",
      fontSize: "10px",
      fontWeight: "800",
      letterSpacing: "0.15em",
      marginRight: "5px",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    },
    i: {
      color: "#475257",
      fontSize: "16px",
    },
    "&:hover": {
      backgroundColor: "#f2f4fd",
      span: { color: "#0190d2" },
      i: { color: "#0190d2" },
    },
  },
});

const LoaderWrapper = styled("div")({
  "& img": {
    maxWidth: "18px",
    maxHeight: "16px",
  },
});

function Card({
  children,
  style,
  className,
  expandable,
  absoluteExpandButton,
  header,
  app,
  cardContentStyle,
  exportTable,
  exportTableId,
  exportContainer,
}) {
  const [isExpanded, setExpand] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);

  const mounted = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const handleExpand = () => {
    if (mounted.current) {
      setExpand(!isExpanded);
    }
  };

  const exportToXLS = async (objectId) => {
    setLoadingExcel(false);
    let id = objectId;

    if (exportContainer) {
      await app.visualization
        .get(objectId)
        .then((vis) => {
          id = vis.model.items.activeId;
        })
        .catch(() => setLoadingExcel(false));
    }

    if (app && id) {
      setLoadingExcel(true);
      await app.visualization
        .get(id)
        .then((vis) => {
          vis.table.exportData({ format: "OOXML", state: "A" }).then((link) => {
            setLoadingExcel(false);
            const newLink = `https://qsense.mtrix.com.br${
              process.env.REACT_APP_PREFIX
            }${link.substring(link.indexOf("tempcontent"))}`;
            window.open(newLink);
          });
        })
        .catch(() => setLoadingExcel(false));
    }
  };

  const Content = () => (
    <div
      className={isExpanded ? "expandedCardContainer" : `${className} card`}
      style={style}
    >
      <div
        className={isExpanded ? "expandedCardContent" : "cardContentArea"}
        style={cardContentStyle}
      >
        <div
          className="cardHeader"
          style={{
            justifyContent: header ? "space-between" : "flex-end",
            alignItems: "center",
          }}
        >
          {header && (
            <ComboHeader
              app={app}
              reference={{
                title: {
                  id: header.titleId,
                  hard: header.hardTitle,
                },
                subtitle: {
                  id: header.subtitle,
                  hard: header.hardSubtitle,
                },
              }}
              tooltip={header.tooltip}
              legends={header.legends}
              radio={header.radio}
              classStyle={header.classStyle}
            />
          )}

          {exportTable && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <ButtonWrapper>
                <button
                  type="button"
                  onClick={() => exportToXLS(exportTableId)}
                >
                  <span>EXPORTAR PARA EXCEL</span>
                  {!loadingExcel ? (
                    <i className="far fa-file-export" />
                  ) : (
                    <LoaderWrapper>
                      <CircleLoader />
                    </LoaderWrapper>
                  )}
                </button>
              </ButtonWrapper>
            </div>
          )}

          {/* {expandable && (
           <div
              className={
                absoluteExpandButton
                  ? "primaryButton expandButton absolute"
                  : "primaryButton expandButton"
              }
            >
              <button type="button" onClick={() => handleExpand()}>
                <span>
                  {isExpanded
                    ? t("general.cardExpanded")
                    : t("general.cardCollapsed")}
                </span>
                <i className="fal fa-expand" />
              </button>
            </div>
          )} */}
        </div>
        {children}
      </div>
    </div>
  );
  return isExpanded ? (
    ReactDom.createPortal(
      <Content />,
      document.getElementById("expandedWrapper"),
    )
  ) : (
    <Content />
  );
}
Card.defaultProps = {
  children: null,
  style: null,
  className: "",
  expandable: false,
  header: null,
  exportTableId: "",
  exportTable: false,
  exportContainer: false,
  app: null,
  cardContentStyle: {},
  absoluteExpandButton: false,
};
Card.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object,
  expandable: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.object,
  exportTableId: PropTypes.string,
  exportContainer: PropTypes.bool,
  exportTable: PropTypes.bool,
  app: PropTypes.object,
  absoluteExpandButton: PropTypes.bool,
  cardContentStyle: PropTypes.object,
};
export default Card;
