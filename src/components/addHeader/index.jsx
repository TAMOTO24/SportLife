// import logo from './logo.svg';
import "./style.css";
import { Outlet, Link } from "react-router-dom";
import Footer from "../addFooter";
import Auth from "../propsAuthModal";

import { useState } from "react";
function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <nav className="nav">
        <ul>
          <img src="./img-pack/logo_white.png" alt="Logo" />
          {[
            { to: "/", label: "Homepage" },
            { to: "/infpage", label: "Trainers" },
            { to: "/news", label: "News & Info" },
            { to: "/layout", label: "Layout" },
            { to: "/clubs", label: "Clubs" },
            { to: "", label: "More" },
          ].map((item) => (
            <Link to={item.to} id="navLink">
              <li id="navElement" key={item.label}>{item.label}</li>
            </Link>
          ))}
          <li
            onClick={() => setIsOpen(!isOpen)}
            className="dropDownButton"
            style={{ cursor: "pointer", paddingInline: "50px" }}
            id="moreBtn"
          >
            Больше {isOpen ? "▲" : "▼"}
            {isOpen && (
              <div className="dropdownBlock">
                <Link to="#"><div id="DRPLink">Промокод</div></Link>
                <Link to="#"><div id="DRPLink">Пополнение</div></Link>
                <Link to="#"><div id="DRPLink">Руководство</div></Link>
              </div>
            )}
          </li>
          <li><Auth /></li>
        </ul>
      </nav>

      <Outlet />

      <Footer />
    </div>
  );
}

export default Header;
