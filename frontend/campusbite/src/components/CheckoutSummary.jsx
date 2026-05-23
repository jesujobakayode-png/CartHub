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
    <div className="h-fit rounded-2xl border border-yellow-700 bg-[#2c1b12] p-5 lg:sticky lg:top-28 lg:p-6">

      <h2 className="mb-6 text-2xl font-bold text-yellow-500 sm:text-3xl">
        Checkout Summary
      </h2>

      <div className="space-y-4 text-base sm:text-lg">

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

        <div className="flex justify-between border-t border-yellow-700 pt-4 text-xl font-bold text-yellow-500 sm:text-2xl">
          <span>Total</span>
          <span>NGN {finalTotal}</span>
        </div>

      </div>

      <button
        onClick={placeOrder}
        className="mt-8 min-h-12 w-full rounded-xl bg-yellow-500 py-3 text-base font-bold text-black transition hover:bg-yellow-400 sm:py-4 sm:text-lg"
      >
        Place Order
      </button>

    </div>
  );
}

export default CheckoutSummary;
