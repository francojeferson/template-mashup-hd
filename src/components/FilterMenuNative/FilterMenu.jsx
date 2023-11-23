import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useBookMarkBar } from "../../context/BookMarkContainer";
import { useFilterBar } from "../../context/FilterBar";
import { useFilters } from "../../context/Filters";
import { useSelections } from "../../context/Selections";
import BookMarkMenu from "../BookMarkMenu/BookMarkMenu";
import NativeFilter from "../NativeFilter/NativeFilter";
import Overlay from "../Overlay/Overlay";
import RightSideMenu from "../RightSideMenu/RightSideMenu";

function FilterMenu({ app, filters, onDemand }) {
  const { filterBarOpened, setFilterBarOpened } = useFilterBar();
  const { selections, setSelections } = useSelections();
  const { bookMarkBarOpened, setBookMarkBarOpened } = useBookMarkBar();
  const { setCurrentPeriod } = useFilters();
  const [forwardCount, setForwardCount] = useState(0);
  const [backCount, setBackCount] = useState(0);
  const [periodoAnalizado, setPeriodoAnalizado] = useState("");
  const objId = useRef(null);
  const mounted = useRef(false);

  async function initialSelecao() {
    await app.variable.getContent("%DC_Periodo", (reply) => {
      const data = reply.qContent.qString;
      setPeriodoAnalizado(data);
    });
  }

  useEffect(() => {
    mounted.current = true;
    //initialSelecao();

    if (!filters || !filters.all || filters.all.length === 0) {
      setFilterBarOpened(false);
    }

    if (!onDemand) {
      const loadCurrentSelections = async () => {
        if (app) {
          await app.getList("CurrentSelections", (res) => {
            if (mounted.current) {
              setForwardCount(res.qSelectionObject.qForwardCount);
              setBackCount(res.qSelectionObject.qBackCount);
              setSelections([...res.qSelectionObject.qSelections]);
              objId.current = res.qInfo.qId;

              const periodoSelection = res.qSelectionObject.qSelections.filter(
                (selection) => selection.qField === "%DC_Periodo",
              );

              if (!periodoSelection.length) {
                return;
              }
              setCurrentPeriod(
                periodoSelection[0]?.qSelectedFieldSelectionInfo[0]?.qName ||
                  "",
              );
            }
          });
        }

        return "";
      };

      loadCurrentSelections();
    } else {
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

      loadCurrentSelections();
    }

    return () => {
      mounted.current = false;
      if (objId.current) {
        app.destroySessionObject(objId.current);
      }
    };
  }, [app]);

  return (
    <div className="filterMenu">
      {filterBarOpened ? (
        <Overlay
          onClick={() => {
            setFilterBarOpened(!filterBarOpened);
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
                  minWidth: "100px",
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
        {filterBarOpened ? (
          <button
            type="button"
            className="buttonFilter closeFilter"
            onClick={() => {
              setFilterBarOpened(false);
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
              setFilterBarOpened(true);
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
      <RightSideMenu
        app={app}
        filters={filters && filters.all ? filters.all : []}
        backCount={backCount}
        forwardCount={forwardCount}
        selections={selections}
      />
    </div>
  );
}

FilterMenu.defaultProps = {
  app: null,
  filters: {},
  onDemand: false,
};

FilterMenu.propTypes = {
  app: PropTypes.object,
  filters: PropTypes.object,
  onDemand: PropTypes.bool,
};

export default FilterMenu;
