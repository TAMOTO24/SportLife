import React from "react";
import "./style.css";
import { Link, useLocation } from "react-router-dom";
import Auth from "../propsAuthModal";
import NotificationElement from "../addNotificationElement";
// import axios from "axios";

import { useState } from "react";
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // if (location.pathname === "/protectedroute") {
  //   return <Outlet />;
  // }

  return (
    <div>
      {location.pathname !== "/workoutprogress" && (
        <nav className="nav">
          <ul>
            <img src="/img-pack/logo/logo_white.png" alt="Logo" id="Logo" />
            {[
              { to: "/", label: "Homepage" },
              { to: "/trainerspage", label: "Trainers" },
              { to: "/newsandinf", label: "News & Info" },
              { to: "", label: "Reviews" },
              { to: "", label: "Plans" },
              { to: "/workoutpage", label: "Workout" },
            ].map((item) => (
              <Link to={item.to} id="navLink">
                <li id="navElement" key={item.label}>
                  {item.label}
                </li>
              </Link>
            ))}
            <li
              onClick={() => setIsOpen(!isOpen)}
              className="dropDownButton"
              id="moreBtn"
            >
              More {isOpen ? "▲" : "▼"}
              {isOpen && (
                <div className="dropdownBlock">
                  <Link to="#">
                    <div id="DRPLink">codes</div>
                  </Link>
                </div>
              )}
            </li>
            <li>
              {location.pathname !== "/authpage" &&
                location.pathname !== "/account" && <Auth />}
            </li>
            <li>
              <NotificationElement />
            </li>
          </ul>
        </nav>
      )}

      {/* <Outlet /> */}
    </div>
  );
}

export default Header;
