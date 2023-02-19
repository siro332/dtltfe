import React from "react";
import { NavLink } from "react-router-dom";

function Navigation({ categories }) {
  return (
    <nav id="navigation">
        {/* container */}
        <div className="container">
          {/* responsive-nav */}
          <div id="responsive-nav">
            {/* NAV */}
            <ul className="main-nav nav navbar-nav">
              <li className="active">
                <NavLink to={"/"}>Trang chủ</NavLink>                
              </li>
              {categories.map((item) =>(
                  <li >
                  <NavLink to={"/category/"+item.code}>{item.name}</NavLink>            
                </li>
                  ))}
            </ul>
            {/* /NAV */}
          </div>
          {/* /responsive-nav */}
        </div>
        {/* /container */}
      </nav>
  );
}
export default Navigation;