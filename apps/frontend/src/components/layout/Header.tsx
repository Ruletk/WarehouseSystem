import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/warehouse">Warehouse</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><LogoutButton /></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
