// import logo from './logo.svg';
import './style.css';
import { Outlet, Link } from "react-router-dom";

function Header() {
  return (
    <>
      <nav className="block">
        <ul>
          <li>
            <Link to="/">Homepage</Link>
          </li>
          <li>
            <Link to="/infpage">Trainers</Link>
          </li>
          <li>
            <Link to="">News & Info</Link>
          </li>
          <li>
            <Link to="">Layout</Link>
          </li>
          <li>
            <Link to="">Clubs</Link>
          </li>
          <li>
            <Link to="">More</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
}

export default Header;
