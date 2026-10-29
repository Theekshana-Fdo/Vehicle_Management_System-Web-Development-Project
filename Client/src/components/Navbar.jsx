import React from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-borderColor">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-8" />
      </Link>
      <div className="flex items-center gap-8">
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;