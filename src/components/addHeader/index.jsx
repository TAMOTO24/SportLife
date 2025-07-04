import React, { useEffect } from "react";
import "./style.css";
import { Link, useLocation } from "react-router-dom";
import Auth from "../propsAuthModal";
import NotificationElement from "../addNotificationElement";
import Cookies from "js-cookie";
import ChatElement from "../addChatElement";
import { socket } from "../../function";

function Header() {
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.startsWith("/classpage") ||
      location.pathname.startsWith("/workoutroom") ||
      location.pathname.startsWith("/workoutprogress")
    ) {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [location.pathname]);

  return (
    <div>
      {!location.pathname.startsWith("/workoutprogress") && (
        <nav className="nav">
          <ul>
            <img src="/img-pack/logo/logo_white.png" alt="Logo" id="Logo" />
            {[
              { to: "/", label: "Головна" },
              { to: "/trainerspage", label: "Тренери" },
              { to: "/newsandinf", label: "Новини та інформація" },
              { to: "/userspage", label: "Користувачі" },
              { to: "/workoutpage", label: "Плани тренувань" },
            ].map((item) => (
              <Link to={item.to} id="navLink">
                <li id="navElement" key={item.label}>
                  {item.label}
                </li>
              </Link>
            ))}
            <li>
              {location.pathname !== "/authpage" &&
                location.pathname !== "/account" && <Auth />}
            </li>
            <li>{Cookies.get("token") && <NotificationElement />}</li>
          </ul>
        </nav>
      )}
      {!location.pathname.startsWith("/classpage") &&
        !location.pathname.startsWith("/workoutroom") &&
        !location.pathname.startsWith("/workoutprogress") &&
        location.pathname !== "/workoutpage" && (
          <>
            {console.log("Рендеримо чат", location.pathname)}
            <ChatElement />
          </>
        )}
    </div>
  );
}

export default Header;
