function CheckoutSummary({
  cart,
  totalPrice,
  placeOrder,
}) {

  const deliveryFee = totalPrice > 0 ? 500 : 0;

  const finalTotal = totalPrice + deliveryFee;

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <div className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-6 sticky top-5 h-fit">

      <h2 className="text-3xl font-bold text-yellow-500 mb-6">
        Checkout Summary
      </h2>

      <div className="space-y-4 text-lg">

        <div className="flex justify-between">
          <span>Total Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>NGN {totalPrice}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>NGN {deliveryFee}</span>
        </div>

        <div className="border-t border-yellow-700 pt-4 flex justify-between text-2xl font-bold text-yellow-500">
          <span>Total</span>
          <span>NGN {finalTotal}</span>
        </div>

      </div>

      <button
        onClick={placeOrder}
        className="w-full mt-8 bg-yellow-500 hover:bg-yellow-400 transition text-black py-4 rounded-xl font-bold text-lg"
      >
        Place Order
      </button>

    </div>
  );
}

export default CheckoutSummary;
