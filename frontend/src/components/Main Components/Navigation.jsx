import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import { MdLocalLibrary } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import AuthContext from "../../context/AuthContext";

export default function Navigation() {
  const { customer, logoutCustomer } = useContext(AuthContext);
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  return (
    <header className="top-0 z-10 bg-gradient-to-b from-green-500 to-emerald-500 py-5 mb-5 px-10">
      <nav className="flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center">
            <MdLocalLibrary
              className={`mr-2 icon ${
                location.pathname === "/" ? "text-gray-800" : "text-white"
              }`}
            />
            <span className="text-white font-bold">BookStore</span>
          </Link>
          <div className="flex space-x-5">
            <NavLink to="/" text="Home" />
            <NavLink to="/categories" text="Categories" />
            <NavLink to="/books" text="Books" />
          </div>
        </div>

        <div className="font-montserrat text-sm flex items-center space-x-5">
          <Link to="/cart">
            <FaShoppingCart
              className={`icon ${
                location.pathname === "/cart" ? "text-gray-800" : "text-white"
              }`}
            />{" "}
          </Link>
          <div className="relative" ref={dropdownRef}>
            <h1
              className={`cursor-pointer flex items-center ${
                location.pathname.startsWith("/customer") || isDropdownOpen
                  ? "text-gray-800"
                  : "text-white"
              }`}
              onClick={toggleDropdown}
            >
              <VscAccount className="icon" /> 
            </h1>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-lg z-50">
                <ul className="py-2 text-sm">
                  <li>
                    {customer ? (
                      <>
                        <p className="block px-4 py-2 text-green-600 hover:bg-gray-100 cursor-pointer">
                          <NavLink
                            to="/customer/dashboard"
                            text="Dashboard"
                            dropdown={true}
                          />
                        </p>
                        <Link
                          to="#"
                          onClick={logoutCustomer}
                          className="block px-4 py-2 text-green-600 hover:bg-gray-100 cursor-pointer hover:text-gray-800"
                        >
                          Logout
                        </Link>
                      </>
                    ) : (
                      <>
                        <p className="block px-4 py-2 text-green-600 hover:bg-gray-100 cursor-pointer">
                          <NavLink
                            to="/customer/register"
                            text="Register"
                            dropdown={true}
                          />
                        </p>
                        <p className="block px-4 py-2 text-green-600 hover:bg-gray-100 cursor-pointer">
                          <NavLink
                            to="/customer/login"
                            text="Login"
                            dropdown={true}
                          />
                        </p>
                      </>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ to, text, dropdown = false }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${
        dropdown
          ? "text-green-600"
          : isActive
          ? "text-gray-800"
          : "text-white"
      } hover:text-gray-800`}
    >
      {text}
    </Link>
  );
}
