import { Link } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const { cart } = useContext(CartContext);

  return (
    <nav className="sticky top-0 z-50 bg-[#2c1b12] border-b border-yellow-700 shadow-lg">

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-yellow-500"
        >
          <FaUtensils />
          CampusBite
        </Link>

        <Link
          to="/vendor-dashboard"
          className="bg-yellow-600 hover:bg-yellow-500 transition px-4 py-2 rounded-lg font-semibold text-black"
        >
          Vendor's Dashboard
        </Link>
        <Link
          to="/cart"
          className="relative text-yellow-500 text-2xl"
        >
          <FaShoppingCart />

          <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cart.length}
          </span>
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;
