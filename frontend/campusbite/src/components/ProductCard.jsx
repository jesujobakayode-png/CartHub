import API from "../services/api";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";



function ProductCard({ product, fetchProducts, isVendor = false, onEdit }) {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleAddToCart = () => {

  if (!user) {

    navigate("/login");

    return;
  }

  addToCart(product);

  if (showToast) showToast({ message: "Item added successfully", type: "success" });
};

  const handleDelete = async () => {
    try {
      await API.delete(`/products/${product._id}`);

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-yellow-800 bg-[#2c1b12] shadow-lg transition-transform duration-200 hover:scale-[1.02]">
      <img
        src={product.image || "https://via.placeholder.com/400"}
        alt={product.name}
        className="aspect-[4/3] w-full object-cover sm:aspect-video"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400";
        }}
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 text-xl font-bold text-yellow-500 sm:text-2xl">
            {product.name}
          </h2>

          <p className="shrink-0 text-base font-semibold sm:text-lg">
            NGN {product.price}
          </p>
        </div>

        <p className="text-sm text-yellow-300 mt-1">{product.category}</p>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-300">
          {product.description}
        </p>

        {isVendor ? (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => onEdit(product)}
              className="min-h-11 rounded-lg bg-yellow-600 py-2 text-center font-semibold text-black transition hover:bg-yellow-500"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="min-h-11 rounded-lg bg-red-600 py-2 font-semibold transition hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="mt-4 min-h-11 w-full rounded-lg bg-yellow-600 py-2 font-bold text-black transition hover:bg-yellow-400"
          >
            Add To Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
