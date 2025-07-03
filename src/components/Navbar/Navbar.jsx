import React from 'react';
import './Navbar.css';
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbarItem">
        <li>
          <NavLink to="/" className={({ isActive }) => "navbarLink" + (isActive ? " navbarLinkActive" : "")}><i className="bi bi-house"></i> Accueil</NavLink>
        </li>
        <li>
          <NavLink to="/movie" className={({ isActive }) => "navbarLink" + (isActive ? " navbarLinkActive" : "")}><i className="bi bi-film"></i> Film</NavLink>
        </li>
        <li>
          <NavLink to="/serie" className={({ isActive }) => "navbarLink" + (isActive ? " navbarLinkActive" : "")}><i className="bi bi-display"></i> Série</NavLink>
        </li>
        <li>
          <NavLink to="/anime" className={({ isActive }) => "navbarLink" + (isActive ? " navbarLinkActive" : "")}><i className="bi bi-robot"></i> Animé</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
