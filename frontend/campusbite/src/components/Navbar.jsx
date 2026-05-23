import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUtensils,
  FaShoppingCart,
  FaReceipt,
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
    <nav className="sticky top-0 z-50 border-b border-yellow-700 bg-[#2c1b12]/95 shadow-lg backdrop-blur">

      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:px-4">

        {/* LOGO */}
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2 text-xl font-bold text-yellow-500 sm:text-2xl"
          >
            <FaUtensils className="shrink-0" />
            <span className="truncate">CampusBite</span>
          </Link>

          {user && (
            <p className="max-w-[45%] truncate text-right text-xs font-semibold text-yellow-400 sm:text-sm">
              Hi, {user?.user?.name || user?.name}
            </p>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="flex w-full items-center justify-between gap-3 overflow-x-auto whitespace-nowrap pb-1">

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-yellow-500 transition hover:bg-yellow-500/10"
              aria-label="Home"
            >
              <FaHome />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl text-yellow-500 transition hover:bg-yellow-500/10"
              aria-label="Cart"
            >
              <FaShoppingCart />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-black">
                {cart.length}
              </span>
            </Link>

            {user?.role === "vendor" && (
              <NavLink
                to="/vendor-dashboard"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-center text-sm font-semibold transition ${isActive ? "bg-yellow-400 text-black" : "bg-yellow-600 text-black hover:bg-yellow-500"}`
                }
              >
                Vendor
              </NavLink>
            )}

            {user && user?.role !== "vendor" && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-center text-sm font-semibold transition ${isActive ? "bg-yellow-400 text-black" : "bg-yellow-600 text-black hover:bg-yellow-500"}`
                }
              >
                Dashboard
              </NavLink>
            )}

            {user && user?.role !== "vendor" && (
              <NavLink
                to="/my-orders"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-center text-sm font-semibold transition ${isActive ? "bg-yellow-400 text-black" : "bg-yellow-600 text-black hover:bg-yellow-500"}`
                }
              >
                <FaReceipt />
                My Orders
              </NavLink>
            )}

            {!user ? (
              <>
                <Link to="/login">
                  <button className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-yellow-400">
                    Sign In
                  </button>
                </Link>

                <Link to="/register">
                  <button className="rounded-lg border border-yellow-500 px-3 py-2 text-sm font-semibold text-yellow-500 transition hover:bg-yellow-500 hover:text-black">
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-red-400"
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
