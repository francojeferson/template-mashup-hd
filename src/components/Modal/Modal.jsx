import { Modal as ModalMui } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useModal } from "../../context/Modal";
import { useQlik } from "../../context/Qlik";
import FilterMenuMobile from "../FilterMenu/FilterMenuMobile";

function Modal({
  show,
  setShow,
  title,
  text,
  children,
  closeButton,
  returnButton,
  filterMenu,
  app,
  config,
}) {
  const { filterBarModalOpened } = useModal();
  const { qlik } = useQlik();
  const isMobile = useMediaQuery({ query: "(max-width: 980px)" });

  useEffect(() => {
    if (qlik) setTimeout(qlik.resize, 500);
  }, [filterBarModalOpened]);

  return (
    <ModalMui
      open={show}
      onClose={() => setShow(false)}
      className={
        filterBarModalOpened && !isMobile ? "modal filterOpened" : "modal"
      }
      disableAutoFocus
    >
      <div className="modalContentWrapper">
        <div className="modalHeader">
          {returnButton && (
            <button
              type="button"
              className="button--return"
              onClick={() => setShow(false)}
            >
              <span>
                <i className="fal fa-long-arrow-left setaFecharModal" />
              </span>
            </button>
          )}
          <span>{title}</span>
          {closeButton && (
            <button
              type="button"
              className="button--close"
              onClick={() => setShow(false)}
            >
              <i className="fal fa-times" />
            </button>
          )}
          {filterMenu && (
            <FilterMenuMobile app={app} filters={config.app?.filters || {}} />
          )}
        </div>
        {children}
      </div>
    </ModalMui>
  );
}

Modal.defaultProps = {
  app: null,
  config: {},
  title: "",
  text: "",
  children: null,
  closeButton: false,
  returnButton: false,
  filterMenu: false,
  show: false,
  setShow: null,
};

Modal.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.any,
  closeButton: PropTypes.bool,
  returnButton: PropTypes.bool,
  filterMenu: PropTypes.bool,
  show: PropTypes.bool,
  setShow: PropTypes.any,
  app: PropTypes.object,
  config: PropTypes.object,
};

export default Modal;
