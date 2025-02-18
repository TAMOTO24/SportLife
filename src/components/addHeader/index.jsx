// import logo from './logo.svg';
import './style.css';
import { Outlet, Link } from "react-router-dom";
import Footer from "../addFooter";

function Header() {
  const items = [
    { label: 'Option 1', key: '1' },
    { label: 'Option 2', key: '2' },
    { label: 'Option 3', key: '3' },
  ];
  return (
    <div>
     <nav className="nav">
        
        <ul>
          <img src='./img-pack/logo_white.png' alt="Logo" />
          {[
            { to: "/", label: "Homepage" },
            { to: "/infpage", label: "Trainers" },
            { to: "/news", label: "News & Info" },
            { to: "/layout", label: "Layout" },
            { to: "/clubs", label: "Clubs" },
            { to: "", label: "More" },
          ].map((item) => (
            <li key={item.label}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />

      <Footer />
    </div>
  );
}

export default Header;
