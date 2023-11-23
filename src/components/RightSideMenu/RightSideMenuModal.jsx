import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useModal } from "../../context/Modal";
import NativeFilter from "../NativeFilter/NativeFilter";
import CurrentSelections from "./CurrentSelections/CurrentSelections";

function RightSideMenuModal({
  app,
  selections,
  backCount,
  forwardCount,
  filters,
}) {
  const [contentTab, setContentTab] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeTab, setActiveTab] = useState("filters");
  const { filterBarModalOpened, setFilterBarModalOpened } = useModal();
  const nodeRef = useRef(null);

  return (
    <div
      className={
        filterBarModalOpened ? "rightSideMenu is-opened" : "rightSideMenu"
      }
    >
      <div className="filtersHeader">
        <div className="titleContainer">
          <button
            type="button"
            onClick={() => {
              setFilterBarModalOpened(false);
            }}
          >
            <i className="fal fa-times" />
          </button>
          <h2>Filtros</h2>
        </div>

        <div className="filterTabs">
          <button
            type="button"
            className={
              activeTab === "filters" ? "filterTab is-active" : "filterTab"
            }
            onClick={() => {
              setActiveTab("filters");
            }}
          >
            <span className="filterTabText">TODOS</span>
          </button>
          <button
            className={
              activeTab === "selections" ? "filterTab is-active" : "filterTab"
            }
            type="button"
            onClick={() => {
              setActiveTab("selections");
            }}
          >
            <span className="filterTabText">SELEÇÕES</span>
            <div className="dot">
              <span className="selectionsCounter">{selections.length}</span>
            </div>
          </button>
        </div>
      </div>
      <TransitionGroup style={{ flex: 1, display: "flex" }}>
        <>
          {activeTab === "filters" ? (
            <ul className="filterList">
              {filters.map((filter) => (
                <NativeFilter
                  onClick={() => {
                    setActiveFilter(filter);
                    setContentTab(true);
                  }}
                  noInteraction
                  key={filter.id}
                  app={app}
                  style={{
                    margin: "6px 0",
                    height: "35px",
                    width: "100%",
                  }}
                  styleContainer={{ height: "max-content" }}
                  reference={filter}
                />
              ))}
            </ul>
          ) : (
            <CurrentSelections app={app} selections={selections} />
          )}
        </>

        {contentTab ? (
          <CSSTransition
            key="filterContent"
            nodeRef={nodeRef}
            timeout={500}
            classNames="filterContent"
          >
            <div ref={nodeRef} className="filterContent">
              <div className="filterContentHeader">
                <button
                  type="button"
                  onClick={() => {
                    setContentTab(false);
                    setActiveFilter(null);
                  }}
                >
                  <i className="fal fa-arrow-left" />
                </button>
                <h2>Voltar</h2>
              </div>
              <NativeFilter
                style={{ height: "100%" }}
                app={app}
                reference={activeFilter}
              />
            </div>
          </CSSTransition>
        ) : (
          ""
        )}
      </TransitionGroup>

      <div className="rightActionButtons">
        <button
          type="button"
          className="buttonAction"
          disabled={!backCount}
          onClick={() => {
            app.back();
          }}
        >
          <i className="fal fa-undo" />
        </button>
        <button
          type="button"
          className="buttonAction"
          style={{ flex: 1 }}
          disabled={!(selections.length > 0)}
          onClick={() => {
            app.clearAll();
          }}
        >
          <i className="removeAllFiltersIcon" />
          <span>LIMPAR TUDO</span>
        </button>
        <button
          type="button"
          className="buttonAction"
          disabled={!forwardCount}
          onClick={() => {
            app.forward();
          }}
        >
          <i className="fal fa-redo" />
        </button>
      </div>
      <button
        type="button"
        className="buttonFinish"
        onClick={() => {
          setFilterBarModalOpened(false);
        }}
      >
        <i className="fal fa-check-circle" />
        <span>FILTRAR</span>
      </button>
    </div>
  );
}

RightSideMenuModal.defaultProps = {
  app: null,
  filters: [],
  selections: [],
  backCount: 0,
  forwardCount: 0,
};

RightSideMenuModal.propTypes = {
  app: PropTypes.object,
  filters: PropTypes.array,
  selections: PropTypes.array,
  backCount: PropTypes.number,
  forwardCount: PropTypes.number,
};

export default RightSideMenuModal;
