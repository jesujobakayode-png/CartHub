import { Link } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-[#2c1b12] border-b border-yellow-700 shadow-lg">

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-yellow-500"
        >
          <FaUtensils />
          CampusBite
        </Link>

        <Link
          to="/add-product"
          className="bg-yellow-600 hover:bg-yellow-500 transition px-4 py-2 rounded-lg font-semibold text-black"
        >
          Add Product
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;