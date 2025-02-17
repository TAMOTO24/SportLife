// import logo from './logo.svg';
import './style.css';
import { Outlet, Link } from "react-router-dom";

function Header() {
  return (
    <>
     <nav className="nav">
        <ul>
          {[
            { to: "/", label: "Homepage" },
            { to: "/infpage", label: "Trainers" },
            { to: "/news", label: "News & Info" },
            { to: "/layout", label: "Layout" },
            { to: "/clubs", label: "Clubs" },
            { to: "/more", label: "More" },
          ].map((item) => (
            <li key={item.label}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default Header;
