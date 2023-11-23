import { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

import styled from "styled-components";
import { useBookMarkBar } from "../../context/BookMarkContainer";
import { useFilterBar } from "../../context/FilterBar";
import { useFilters } from "../../context/Filters";
import { useSelections } from "../../context/Selections";
import BookMarkMenu from "../BookMarkMenu/BookMarkMenu";
import FilterContainer from "../FilterContainer/FilterContainer";
import Modal from "../Modal/Modal";
import Overlay from "../Overlay/Overlay";
import RightSideMenu from "../RightSideMenu/RightSideMenu";

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .primaryButton pdv {
    align-self: center;
    justify-content: center;
  }
`;

function FilterMenu({ app, filters, onDemand, config }) {
  const { filterBarOpened, setFilterBarOpened } = useFilterBar();
  const { selections, setSelections } = useSelections();
  const { bookMarkBarOpened, setBookMarkBarOpened } = useBookMarkBar();
  const { setCurrentPeriod } = useFilters();
  const [forwardCount, setForwardCount] = useState(0);
  const [backCount, setBackCount] = useState(0);
  const objId = useRef(null);
  const mounted = useRef(false);

  const [modalOpened, setModalOpened] = useState(false);
  const conjuntoModal = useRef(0);

  function showModal(index) {
    conjuntoModal.current = index;
    setModalOpened(true);
  }

  function closeModal() {
    setModalOpened(false);
  }

  useEffect(() => {
    mounted.current = true;

    if (!filters || !filters.all || filters.all.length === 0) {
      setFilterBarOpened(false);
    }

    const loadCurrentSelections = async () => {
      if (app) {
        await app.getList("CurrentSelections", (res) => {
          if (mounted.current) {
            setForwardCount(res.qSelectionObject.qForwardCount);
            setBackCount(res.qSelectionObject.qBackCount);
            console.log("current", res);
            setSelections([...res.qSelectionObject.qSelections]);
            objId.current = res.qInfo.qId;
          }
        });
      }
      return "";
    };
    loadCurrentSelections();
    return () => {
      mounted.current = false;
      if (objId.current) {
        app.destroySessionObject(objId.current);
      }
    };
  }, [app]);

  const ModalButton = ({ title, onClick }) => (
    <ButtonWrapper>
      <div className="primaryButton pdv " aria-hidden="true" onClick={onClick}>
        <button type="button">
          <div className="row" style={{ alignItems: "center" }}>
            <span>{title}</span>
          </div>
        </button>
      </div>
    </ButtonWrapper>
  );

  return (
    <div className="filterMenu">
      {modalOpened && (
        <Modal
          title="Filtros"
          show={modalOpened}
          setShow={() => closeModal()}
          closeButton
        >
          <FilterContainer
            app={app}
            config={filters}
            index={conjuntoModal.current}
          />
        </Modal>
      )}
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
          ? filters.main.map((filter, index) => (
              <ModalButton
                key={filter.id}
                title={filter.label}
                onClick={() => showModal(index)}
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
      {
        <BookMarkMenu
          app={app}
          filters={filters && filters.all ? filters.all : []}
          backCount={backCount}
          forwardCount={forwardCount}
          selections={selections}
        />
      }
      {
        <RightSideMenu
          app={app}
          filters={filters && filters.all ? filters.all : []}
          backCount={backCount}
          forwardCount={forwardCount}
          selections={selections}
        />
      }
    </div>
  );
}

FilterMenu.defaultProps = {
  app: null,
  filters: {},
  config: {},
  onDemand: false,
};

FilterMenu.propTypes = {
  app: PropTypes.object,
  filters: PropTypes.object,
  config: PropTypes.object,
  onDemand: PropTypes.bool,
};

export default FilterMenu;
