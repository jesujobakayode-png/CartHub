import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUtensils,
  FaShoppingCart,
} from "react-icons/fa";

import { useContext } from "react";

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function Navbar() {

  const { user, logout } =
    useContext(AuthContext);

  const navigate = useNavigate();


  const { cart, clearCart } = useContext(CartContext);

  const handleLogout = () => {
  clearCart();
  logout();
  navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#2c1b12] border-b border-yellow-700 shadow-lg">

      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">

        {/* LOGO */}
        <div className="flex items-center justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-yellow-500"
          >
            <FaUtensils />
            CampusBite
          </Link>
        </div>

        {/* NAVIGATION */}
        <div className="w-full flex items-center justify-between gap-2 overflow-x-auto whitespace-nowrap py-2">

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-yellow-500 text-2xl min-w-10"
            >
              <FaHome />
            </Link>

            {user && (
              <p className="text-yellow-400 font-semibold text-sm whitespace-nowrap">
                Hi, {user?.user?.name || user?.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative text-yellow-500 text-2xl min-w-10"
            >
              <FaShoppingCart />
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            </Link>

            {user?.role === "vendor" && (
              <NavLink
                to="/vendor-dashboard"
                className={({ isActive }) =>
                  `text-center px-3 py-2 rounded-lg font-semibold text-sm transition ${isActive ? "bg-yellow-400 text-black" : "bg-yellow-600 hover:bg-yellow-500 text-black"}`
                }
              >
                Vendor
              </NavLink>
            )}

            {user && user?.role !== "vendor" && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `text-center px-3 py-2 rounded-lg font-semibold text-sm transition ${isActive ? "bg-yellow-400 text-black" : "bg-yellow-600 hover:bg-yellow-500 text-black"}`
                }
              >
                Dashboard
              </NavLink>
            )}

            {!user ? (
              <>
                <Link to="/login">
                  <button className="px-3 py-2 rounded-lg text-sm bg-yellow-500 hover:bg-yellow-400 text-black font-semibold whitespace-nowrap">
                    Sign In
                  </button>
                </Link>

                <Link to="/register">
                  <button className="px-3 py-2 rounded-lg text-sm border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-semibold whitespace-nowrap">
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-sm bg-red-500 hover:bg-red-400 text-black font-semibold whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            )}
          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;