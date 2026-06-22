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
    <div className="overflow-hidden rounded-xl border border-stone-300 bg-[#fbfaf7] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md">
      <img
        src={product.image || "https://via.placeholder.com/400"}
        alt={product.name}
        className="aspect-4/3 w-full bg-stone-100 object-cover sm:aspect-video"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400";
        }}
      />

      <div className="border-t border-stone-100 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 text-lg font-bold text-stone-950 sm:text-xl">
            {product.name}
          </h2>

          <p className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700 sm:text-base">
            NGN {product.price}
          </p>
        </div>

        <p className="mt-2 text-sm font-semibold text-amber-700">{product.category}</p>

        {product.vendor && (
          <p className="mt-2 text-sm text-stone-600">Sold by: <span className="font-semibold text-stone-800">{product.vendor.name || product.vendor}</span></p>
        )}

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-700">
          {product.description}
        </p>

        {isVendor ? (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => onEdit(product)}
              className="min-h-11 rounded-lg border border-amber-500 bg-amber-500 py-2 text-center font-semibold text-black transition hover:bg-amber-400"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="min-h-11 rounded-lg border border-red-200 bg-red-50 py-2 font-semibold text-red-700 transition hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="mt-4 min-h-11 w-full rounded-lg border border-amber-500 bg-amber-500 py-2 font-bold text-black transition hover:bg-amber-400"
          >
            Add To Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
