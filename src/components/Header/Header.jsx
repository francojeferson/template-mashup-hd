import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// COMPONENTS
import Overlay from "../Overlay/Overlay";

// HOOKS
import { useBookMarkBar } from "../../context/BookMarkContainer";
import { useFilterBar } from "../../context/FilterBar";
import { useLeftBar } from "../../context/LeftBar";
import { useSelections } from "../../context/Selections";

function Header({ className }) {
  const slug = useLocation();
  const [locationPath, setLocationPath] = useState("");
  const { leftBarOpened, setLeftBarOpened } = useLeftBar();
  const { filterBarOpened, setFilterBarOpened } = useFilterBar();
  const { selections } = useSelections();
  const { bookMarkBarOpened, setBookMarkBarOpened } = useBookMarkBar();

  useEffect(() => {
    const change = slug.pathname
      .replace("/", "")
      .replaceAll("-", " ")
      .replace("/", " / ");
    setLocationPath(change);
  }, [slug]);

  return (
    <div className="wrapper">
      {/* HEADER MOBILE */}
      <div className={`mobileHeader ${className}`}>
        {leftBarOpened && (
          <Overlay
            onClick={() => {
              setLeftBarOpened(!leftBarOpened);
            }}
          />
        )}
        <div className="burgerContainer">
          <button
            type="button"
            className="burger-button"
            onClick={() => {
              setLeftBarOpened(!leftBarOpened);
            }}
          >
            <i className="fal fa-bars" />
          </button>
          <h1 className="burger-title">{locationPath}</h1>
        </div>

        <div className="buttonsContainer">
          <button
            type="button"
            className="button-action"
            onClick={() => {
              setFilterBarOpened(!filterBarOpened);
            }}
          >
            <i className="fal fa-filter" />
            <div className="dot dot--primary">
              <span className="selectionsCounter">{selections.length}</span>
            </div>
          </button>
          <button
            type="button"
            className="button-action"
            onClick={() => {
              setBookMarkBarOpened(!bookMarkBarOpened);
            }}
          >
            <i className="fal fa-star" />
          </button>
        </div>
      </div>
    </div>
  );
}

Header.defaultProps = {
  className: "",
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
