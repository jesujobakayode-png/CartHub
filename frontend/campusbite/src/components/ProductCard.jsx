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
    <div className="bg-[#2c1b12] rounded-2xl overflow-hidden shadow-lg border border-yellow-800">
      <img
        src={product.image || "https://via.placeholder.com/400"}
        alt={product.name}
        className="w-full h-52 object-cover"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400";
        }}
      />

      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-yellow-500">
            {product.name}
          </h2>

          <p className="text-lg font-semibold">NGN {product.price}</p>
        </div>

        <p className="text-sm text-yellow-300 mt-1">{product.category}</p>

        <p className="text-gray-300 mt-3 text-sm">{product.description}</p>

        {isVendor ? (
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-center py-2 rounded-lg font-semibold text-black transition"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-500 py-2 rounded-lg font-semibold transition"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full mt-4 bg-yellow-600 hover:bg-yellow-400 text-black py-2 rounded-lg font-bold transition"
          >
            Add To Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
