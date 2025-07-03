import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getPageTitle } from '../../utils/pageTitles'; 
import './Header.css';

function Header() {

  const location = useLocation();
  const navigate = useNavigate();
  const title = getPageTitle(location.pathname);

  const backArrowRoutes = [
    "/anime/tosee", 
    "/anime/watched", 
    "/anime/inprogress", 
    "/settings", 
    "/movie/tosee", 
    "/movie/watched",
    "/serie/tosee",
    "/serie/watched",
    "/serie/inprogress"
  ];
  
  const showBackArrow = backArrowRoutes.includes(location.pathname);

  return (
    <>
    <div className="header">
      <div className="headerYou">
          {showBackArrow ? (
            <i className="bi bi-arrow-left" style={{ cursor: "pointer", fontSize: "1.5rem" }} onClick={() => navigate(-1)} title="Retour"></i>
          ) : (
            <div className="headerLogo">
              <img src="favicon.png" alt="Logo"/>
            </div>
          )}
        <h3>{title}</h3>
      </div>
      <div className="headerSettings">
        <Link to="settings"><i className="bi bi-gear"></i></Link>
      </div>
    </div>
    </>
  );
};

export default Header;