import { CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useBookMarkBar } from "../../context/BookMarkContainer";
import { useExportId } from "../../context/ExportId";
import { useModal } from "../../context/Modal";
import { useSelections } from "../../context/Selections";
import BookMarkMenu from "../BookMarkMenu/BookMarkMenu";
import Overlay from "../Overlay/Overlay";
import RightSideMenuModal from "../RightSideMenu/RightSideMenuModal";

function FilterMenuMobile({ app, filters }) {
  const { filterBarModalOpened, setFilterBarModalOpened } = useModal();

  const { selections, setSelections } = useSelections();
  const { bookMarkBarOpened, setBookMarkBarOpened } = useBookMarkBar();
  const [forwardCount, setForwardCount] = useState(0);
  const [backCount, setBackCount] = useState(0);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const objId = useRef(null);
  const { exportId } = useExportId();
  const mounted = useRef(false);

  const loadCurrentSelections = async () => {
    if (app) {
      await app.getList("CurrentSelections", (res) => {
        if (mounted.current) {
          setForwardCount(res.qSelectionObject.qForwardCount);
          setBackCount(res.qSelectionObject.qBackCount);
          setSelections([...res.qSelectionObject.qSelections]);
          objId.current = res.qInfo.qId;
        }
      });
    }

    return "";
  };

  const exportToXLS = () => {
    setLoadingExcel(false);

    if (app && exportId) {
      setLoadingExcel(true);

      app.visualization
        .get(exportId)
        .then((vis) => {
          vis.exportData({ format: "CSV_T" }).then((link) => {
            setLoadingExcel(false);
            window.open(link);
          });
        })
        .catch(() => setLoadingExcel(false));
    }
  };

  useEffect(() => {
    if (!filters || !filters.all || filters.all.length === 0) {
      setFilterBarModalOpened(false);
    }
    loadCurrentSelections();
    return () => {
      mounted.current = false;
      if (app) app.destroySessionObject(objId.current);
      setFilterBarModalOpened(false);
    };
  }, [app]);

  return (
    <div className="filterMenuMobile">
      <div style={{ display: "flex" }}>
        <button
          type="button"
          className="exportButtonMobile"
          onClick={() => exportToXLS()}
        >
          {loadingExcel ? (
            <CircularProgress size="13px" />
          ) : (
            <i className="far fa-file-export" />
          )}
        </button>
        {filterBarModalOpened ? (
          <Overlay
            onClick={() => {
              setFilterBarModalOpened(!filterBarModalOpened);
            }}
          />
        ) : (
          ""
        )}
        {filterBarModalOpened ? (
          <button
            type="button"
            className="buttonFilter closeFilter"
            onClick={() => {
              setFilterBarModalOpened(false);
            }}
          >
            <i className="fal fa-filter" />
            <span>Fechar</span>
          </button>
        ) : (
          <button
            type="button"
            className="buttonFilterMobile"
            onClick={() => {
              setFilterBarModalOpened(true);
            }}
          >
            <i className="fal fa-filter" />
            <div className="dotMobile">
              <span className="selectionsCounter">{selections.length}</span>
            </div>
          </button>
        )}
        <button
          type="button"
          className="favoriteButton"
          onClick={() => setBookMarkBarOpened(!bookMarkBarOpened)}
        >
          <i className="far fa-star" />
        </button>
      </div>
      <BookMarkMenu
        app={app}
        filters={filters && filters.all ? filters.all : []}
        backCount={backCount}
        forwardCount={forwardCount}
        selections={selections}
      />

      <RightSideMenuModal
        app={app}
        filters={filters && filters.all ? filters.all : []}
        backCount={backCount}
        forwardCount={forwardCount}
        selections={selections}
      />
    </div>
  );
}

FilterMenuMobile.defaultProps = {
  app: null,
  filters: {},
};

FilterMenuMobile.propTypes = {
  app: PropTypes.object,
  filters: PropTypes.object,
};

export default FilterMenuMobile;
