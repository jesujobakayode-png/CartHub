import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUtensils,
  FaShoppingCart,
} from "react-icons/fa";

import { useContext } from "react";

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function Navbar() {

  const { cart } = useContext(CartContext);

  const { user, logout } =
    useContext(AuthContext);

  const navigate = useNavigate();


  const handleLogout = () => {

    logout();

    navigate("/login");
  };


  return (
    <nav className="sticky top-0 z-50 bg-[#2c1b12] border-b border-yellow-700 shadow-lg">

      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">

        {/* LOGO */}
        <div className="flex items-center justify-center sm:justify-start">

          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-yellow-500"
          >
            <FaUtensils />

            CampusBite
          </Link>

        </div>


        {/* NAVIGATION */}
        <div className="flex flex-row flex-wrap items-center justify-around sm:justify-between w-full gap-3">

          {/* HOME */}
          <Link
            to="/"
            className="text-yellow-500 text-2xl"
          >
            <FaHome />
          </Link>


          {/* VENDOR DASHBOARD */}
          {user?.user?.role === "vendor" && (

            <Link
              to="/vendor"
              className="bg-yellow-600 hover:bg-yellow-500 transition px-4 py-2 rounded-lg font-semibold text-black"
            >
              Vendor Dashboard
            </Link>

          )}


          {/* CART */}
          <Link
            to="/cart"
            className="relative text-yellow-500 text-2xl"
          >
            <FaShoppingCart />

            <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          </Link>


          {/* AUTH SECTION */}
          {!user ? (

            <div className="flex items-center gap-3">

              <Link to="/login">

                <button className="bg-yellow-500 hover:bg-yellow-400 transition text-black px-4 py-2 rounded-lg font-semibold">

                  Sign In

                </button>

              </Link>


              <Link to="/register">

                <button className="border border-yellow-500 hover:bg-yellow-500 hover:text-black transition px-4 py-2 rounded-lg text-yellow-500">

                  Register

                </button>

              </Link>

            </div>

          ) : (

            <div className="flex items-center gap-3">

              <p className="text-yellow-400 font-semibold">

                Hi, {user.user.name}

              </p>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-400 transition px-4 py-2 rounded-lg font-semibold"
              >
                Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;