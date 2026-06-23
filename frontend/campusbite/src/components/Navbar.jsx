import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaStore,
  FaShoppingCart,
  FaReceipt,
  FaBell,
} from "react-icons/fa";

import { useContext, useEffect, useState } from "react";

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { onEvent, offEvent } from "../utils/socket";

function Navbar() {

  const [newOrderCount, setNewOrderCount] = useState(0);
  const { user, logout } = useContext(AuthContext);
  const { unreadCount } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const isVendor = user?.role?.toLowerCase() === "vendor";

  const { cart, clearCart } = useContext(CartContext);

  const handleLogout = () => {
    clearCart();
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!isVendor) {
      return;
    }

    const handleNewOrder = () => {
      setNewOrderCount((count) => count + 1);
    };

    onEvent("newOrder", handleNewOrder);

    return () => {
      offEvent("newOrder", handleNewOrder);
    };
  }, [isVendor]);

  useEffect(() => {
    if (location.pathname.startsWith("/vendor-dashboard")) {
      setNewOrderCount(0);
    }
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-300 bg-[#fbfaf7]/95 shadow-sm backdrop-blur">

      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:px-4 lg:flex-row lg:items-center lg:justify-between">

        {/* LOGO */}
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2 text-xl font-bold text-amber-600 sm:text-2xl"
          >
            <FaStore className="shrink-0" />
            <span className="truncate">CampusBite</span>
          </Link>

          {user && (
            <p className="max-w-[45%] truncate rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-right text-xs font-semibold text-amber-700 sm:text-sm">
              Hi, {user?.user?.name || user?.name}
            </p>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="flex w-full items-center justify-between gap-3 overflow-x-auto whitespace-nowrap pb-1 lg:w-auto lg:pb-0">

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-300 bg-[#fbfaf7] text-xl text-amber-700 transition hover:border-amber-300 hover:bg-amber-50"
              aria-label="Home"
            >
              <FaHome />
            </Link>
            <NavLink
              to="/vendors"
              className={({ isActive }) =>
                `hidden sm:inline-flex h-10 items-center gap-3 rounded-lg border px-3 py-2 text-sm font-semibold transition ${isActive ? "border-amber-500 bg-amber-500 text-black" : "border-stone-300 bg-[#fbfaf7] text-stone-700 hover:border-amber-300 hover:bg-amber-50"}`
              }
            >
              Vendors
            </NavLink>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stone-300 bg-[#fbfaf7] text-xl text-amber-700 transition hover:border-amber-300 hover:bg-amber-50"
              aria-label="Cart"
            >
              <FaShoppingCart />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs text-black">
                {cart.length}
              </span>
            </Link>

            {isVendor && (
              <NavLink
                to="/vendor-dashboard"
                className={({ isActive }) =>
                  `relative rounded-lg border px-3 py-2 text-center text-sm font-semibold transition ${isActive ? "border-amber-500 bg-amber-500 text-black" : "border-stone-300 bg-[#fbfaf7] text-stone-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"}`
                }
              >
                Vendor
                {newOrderCount > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {newOrderCount}
                  </span>
                )}
              </NavLink>
            )}

            {isVendor && (
              <NavLink
                to="/vendor-profile"
                className={({ isActive }) =>
                  `rounded-lg border px-3 py-2 text-center text-sm font-semibold transition ${isActive ? "border-amber-500 bg-amber-500 text-black" : "border-stone-300 bg-[#fbfaf7] text-stone-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"}`
                }
              >
                Profile
              </NavLink>
            )}

            {user && !isVendor && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `rounded-lg border px-3 py-2 text-center text-sm font-semibold transition ${isActive ? "border-amber-500 bg-amber-500 text-black" : "border-stone-300 bg-[#fbfaf7] text-stone-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"}`
                }
              >
                Dashboard
              </NavLink>
            )}

            {user && !isVendor && (
              <NavLink
                to="/my-orders"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-center text-sm font-semibold transition ${isActive ? "border-amber-500 bg-amber-500 text-black" : "border-stone-300 bg-[#fbfaf7] text-stone-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"}`
                }
              >
                <FaReceipt />
                My Orders
              </NavLink>
            )}

            {user && (
              <button
                type="button"
                onClick={() => navigate("/notifications")}
                className={`relative flex h-10 w-10 items-center justify-center rounded-lg border px-0 text-xl transition ${
                  unreadCount > 0
                    ? "border-red-500 bg-red-100 text-red-700 shadow-sm shadow-red-200"
                    : "border-stone-300 bg-[#fbfaf7] text-amber-700 hover:border-amber-300 hover:bg-amber-50"
                }`}
                aria-label="Notifications"
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {!user ? (
              <>
                <Link to="/login">
                  <button className="rounded-lg border border-amber-500 bg-amber-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-amber-400">
                    Sign In
                  </button>
                </Link>

                <Link to="/register">
                  <button className="rounded-lg border border-stone-300 bg-[#fbfaf7] px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700">
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
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
