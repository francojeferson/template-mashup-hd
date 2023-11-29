import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBookMarkBar } from "../../context/BookMarkContainer";
import { useModal } from "../../context/Modal";
import { useSelections } from "../../context/Selections";
import BookMarkMenu from "../BookMarkMenu/BookMarkMenu";
import NativeFilter from "../NativeFilter/NativeFilter";
import Overlay from "../Overlay/Overlay";
import RightSideMenuModal from "../RightSideMenu/RightSideMenuModal";

function FilterMenuModal({ app, filters }) {
  const { filterBarModalOpened, setFilterBarModalOpened } = useModal();
  const { selections, setSelections } = useSelections();
  const { bookMarkBarOpened, setBookMarkBarOpened } = useBookMarkBar();
  const [forwardCount, setForwardCount] = useState(0);
  const [backCount, setBackCount] = useState(0);
  const objId = useRef(null);

  const loadCurrentSelections = useCallback(async () => {
    if (app) {
      await app.getList("CurrentSelections", (res) => {
        setForwardCount(res.qSelectionObject.qForwardCount);
        setBackCount(res.qSelectionObject.qBackCount);
        setSelections(res.qSelectionObject.qSelections);
        objId.current = res.qInfo.qId;
      });
    }
  }, []);

  useEffect(() => {
    if (!filters || !filters.all || filters.all.length === 0) {
      setFilterBarModalOpened(false);
    }
    loadCurrentSelections();
    return () => {
      setFilterBarModalOpened(false);
      if (app) app.destroySessionObject(objId.current);
    };
  }, []);

  return (
    <div className="filterMenu">
      {filterBarModalOpened ? (
        <Overlay
          onClick={() => {
            setFilterBarModalOpened(!filterBarModalOpened);
          }}
        />
      ) : (
        ""
      )}
      <div className="mainFilterList">
        {filters && filters.main
          ? filters.main.map((filter) => (
              <NativeFilter
                key={filter.id}
                app={app}
                style={{
                  height: "35px",
                  width: "207px",
                  marginRight: "6px",
                }}
                reference={filter}
              />
            ))
          : ""}
      </div>
      <div style={{ display: "flex" }}>
        <div className="filterButtonActions">
          <button
            type="button"
            className={backCount ? "buttonAction" : "buttonAction disabled"}
            onClick={() => {
              app.back();
            }}
          >
            <i className="fal fa-undo" />
          </button>
          <button
            type="button"
            className={forwardCount ? "buttonAction" : "buttonAction disabled"}
            onClick={() => {
              app.forward();
            }}
          >
            <i className="fal fa-redo" />
          </button>
          <button
            type="button"
            className={
              selections.length > 0 ? "buttonAction" : "buttonAction disabled"
            }
            onClick={() => {
              app.clearAll();
            }}
          >
            <i className="removeAllFiltersIcon" />
          </button>
        </div>
        <button
          type="button"
          className="favoriteButton"
          onClick={() => setBookMarkBarOpened(!bookMarkBarOpened)}
        >
          <i className="far fa-star" />
        </button>
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
            className="buttonFilter"
            onClick={() => {
              setFilterBarModalOpened(true);
            }}
          >
            <i className="fal fa-filter" />
            <span>Todos os filtros</span>
            <div className="dot">
              <span className="selectionsCounter">{selections.length}</span>
            </div>
          </button>
        )}
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

FilterMenuModal.defaultProps = {
  app: null,
  filters: {},
};

FilterMenuModal.propTypes = {
  app: PropTypes.object,
  filters: PropTypes.object,
};

export default FilterMenuModal;
