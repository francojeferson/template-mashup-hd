import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";
import styled from "styled-components";
import ComboHeader from "../ComboHeader/ComboHeader";
import CircleLoader from "../Loaders/CircleLoader";
import TooltipInfo from "../TooltipInfo/TooltipInfo";

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
  modalDetail,
  onClickModal,
  tooltip,
  tooltipKpi,
}) {
  const [isExpanded, setExpand] = useState(false);
  const mounted = useRef();
  const [loadingExcel, setLoadingExcel] = useState(false);

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

  const actionsButton = () => {
    if (exportTable && expandable) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ButtonWrapper>
            <button type="button" onClick={() => exportToXLS(exportTableId)}>
              {!loadingExcel ? (
                <i className="far fa-file-export" />
              ) : (
                <LoaderWrapper>
                  <CircleLoader />
                </LoaderWrapper>
              )}
            </button>
          </ButtonWrapper>
          <div
            className={
              absoluteExpandButton
                ? "primaryButton expandButton absolute"
                : "primaryButton expandButton"
            }
          >
            <button type="button" onClick={() => handleExpand()}>
              <i className="fal fa-expand" />
            </button>
          </div>
        </div>
      );
    }
    if (expandable) {
      return (
        <div
          className={
            absoluteExpandButton
              ? "primaryButton expandButton absolute"
              : "primaryButton expandButton"
          }
        >
          <button type="button" onClick={() => handleExpand()}>
            <i className="fal fa-expand" />
          </button>
        </div>
      );
    }
    if (exportTable && modalDetail) {
      return (
        <>
          <ButtonWrapper>
            <div aria-hidden="true" onClick={onClickModal}>
              <button style={{ height: "34px" }} type="button">
                <div
                  className="row"
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {tooltip && (
                    <TooltipInfo
                      text={tooltip}
                      style={{ marginRight: "8px" }}
                    />
                  )}
                </div>
              </button>
            </div>
          </ButtonWrapper>
          <ButtonWrapper>
            <button type="button" onClick={() => exportToXLS(exportTableId)}>
              {!loadingExcel ? (
                <i className="far fa-file-export" />
              ) : (
                <LoaderWrapper>
                  <CircleLoader />
                </LoaderWrapper>
              )}
            </button>
          </ButtonWrapper>
        </>
      );
    }
    if (exportTable) {
      return (
        <ButtonWrapper>
          <button type="button" onClick={() => exportToXLS(exportTableId)}>
            {!loadingExcel ? (
              <i className="far fa-file-export" />
            ) : (
              <LoaderWrapper>
                <CircleLoader />
              </LoaderWrapper>
            )}
          </button>
        </ButtonWrapper>
      );
    }
  };

  // useEffect(async () => {
  //   await app.visualization
  //     .get(tableId)
  //     .then((vis) => {
  //       vis.table.exportData({ format: "CSV_C" }).then((link) => {
  //         setLoadingExcel(false);
  //         window.open(link);
  //       });
  //     })
  //     .catch(() => setLoadingExcel(false));
  // }, [tableId]);

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
            marginBottom: "2px",
          }}
        >
          {tooltipKpi && (
            <TooltipInfo
              text={tooltipKpi}
              style={{
                marginLeft: "8px",
                position: "relative",
                marginTop: "-16px",
                marginRight: "-16px",
              }}
            />
          )}
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

          {actionsButton()}
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
  exportContainer: false,
  exportTable: false,
  exportTableId: "",
  modalDetail: false,
  header: null,
  app: null,
  onClickModal: () => {},
  cardContentStyle: {},
  absoluteExpandButton: false,
};
Card.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object,
  expandable: PropTypes.bool,
  exportContainer: PropTypes.bool,
  exportTable: PropTypes.bool,
  exportTableId: PropTypes.string,
  modalDetail: PropTypes.bool,
  onClickModal: PropTypes.func,
  className: PropTypes.string,
  header: PropTypes.object,
  app: PropTypes.object,
  absoluteExpandButton: PropTypes.bool,
  cardContentStyle: PropTypes.object,
};
export default Card;
