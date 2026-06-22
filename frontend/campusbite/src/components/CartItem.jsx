function CartItem({
  item,
  removeFromCart,
  increaseQty,
  decreaseQty,
}) {

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-stone-300 bg-[#fbfaf7] p-4 shadow-sm sm:flex-row">

      <img
        src={item.image || "https://via.placeholder.com/200"}
        alt={item.name}
        className="aspect-video w-full rounded-xl border border-stone-100 bg-stone-100 object-cover sm:h-28 sm:w-28 sm:shrink-0"
      />

      <div className="min-w-0 flex-1">

        <h2 className="truncate text-xl font-bold text-stone-950 sm:text-2xl">
          {item.name}
        </h2>

        <p className="mt-2">
          NGN {item.price}
        </p>

        <div className="mt-4 flex items-center gap-3">

          <button
            onClick={() => decreaseQty(item._id)}
            className="h-10 w-10 rounded-lg border border-amber-500 bg-amber-500 font-bold text-black transition hover:bg-amber-400"
          >
            -
          </button>

          <span className="min-w-6 text-center font-semibold">{item.quantity}</span>

          <button
            onClick={() => increaseQty(item._id)}
            className="h-10 w-10 rounded-lg border border-amber-500 bg-amber-500 font-bold text-black transition hover:bg-amber-400"
          >
            +
          </button>

        </div>

      </div>

      <button
        onClick={() => removeFromCart(item._id)}
        className="min-h-11 rounded-lg border border-red-200 bg-red-50 px-4 font-semibold text-red-700 transition hover:bg-red-100 sm:self-center"
      >
        Remove
      </button>

    </div>
  );
}

export default CartItem;
