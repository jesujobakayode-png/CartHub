import { useContext } from "react";

import { CartContext } from "../context/CartContext";
import CartItem from "../components/CartItem";
import API from "../services/api";
import { ToastContext } from "../context/ToastContext";
import CheckoutSummary from "../components/CheckoutSummary";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
  } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      if (showToast) {
        showToast({
          message: "Please login to place an order",
          type: "error",
        });
      }
      return;
    }

    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice,
      };

      await API.post("/orders", orderData);

      if (showToast) {
        showToast({
          message: "Order placed successfully!",
          type: "success",
        });
      }

      clearCart();
    } catch (error) {
      console.log(error);
      if (showToast) {
        showToast({
          message: error.response?.data?.message || "Order failed",
          type: "error",
        });
      }
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-yellow-500 mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-10 text-center">
          <h2 className="text-2xl text-yellow-500 font-bold">Your cart is empty</h2>
          <p className="text-gray-300 mt-3">Add delicious meals from vendors.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            {cart.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                removeFromCart={removeFromCart}
                increaseQty={increaseQty}
                decreaseQty={decreaseQty}
              />
            ))}
          </div>

          <CheckoutSummary cart={cart} totalPrice={totalPrice} placeOrder={placeOrder} />
        </div>
      )}
    </div>
  );
}

export default Cart;
