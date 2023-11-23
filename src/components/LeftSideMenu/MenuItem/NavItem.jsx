import PropTypes from "prop-types";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLeftBar } from "../../../context/LeftBar";

function NavItem({ icon, name, path, subpages }) {
  const { leftBarOpened } = useLeftBar();
  const [showSubPageItems, setShowSubPageItems] = useState(false);
  return (
    <li className="navItem">
      <NavLink
        to={path}
        activeClassName="active"
        onClick={(e) => {
          if (subpages) {
            e.preventDefault();
            setShowSubPageItems(!showSubPageItems);
          }
        }}
      >
        <div className="navItemNameContainer">
          <i className={`${icon}`} />
          <span
            className={leftBarOpened ? "navItemName" : "navItemName is-hidden"}
          >
            {name}
          </span>
        </div>
      </NavLink>
      {subpages && leftBarOpened && (
        <>
          <i
            className={
              showSubPageItems ? "fal fa-angle-up" : "fal fa-angle-down"
            }
          />
          <ul
            className={
              showSubPageItems
                ? "subPagesList showSubPageItems"
                : "subPagesList"
            }
          >
            {showSubPageItems &&
              subpages.map((subpage) => (
                <li className="subNavItems" key={subpage.id}>
                  <NavLink
                    className="subNavLink"
                    to={subpage.url}
                    activeClassName="subItemActive"
                  >
                    {subpage.name}
                  </NavLink>
                </li>
              ))}
          </ul>
        </>
      )}
    </li>
  );
}

NavItem.defaultProps = {
  icon: "",
  name: "",
  path: "",
  subpages: undefined,
};

NavItem.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string,
  path: PropTypes.string,
  subpages: PropTypes.array,
};

export default NavItem;
