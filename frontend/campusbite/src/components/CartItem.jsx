function CartItem({
  item,
  removeFromCart,
  increaseQty,
  decreaseQty,
}) {

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-yellow-700 bg-[#2c1b12] p-4 sm:flex-row">

      <img
        src={item.image || "https://via.placeholder.com/200"}
        alt={item.name}
        className="aspect-video w-full rounded-xl object-cover sm:h-28 sm:w-28 sm:shrink-0"
      />

      <div className="min-w-0 flex-1">

        <h2 className="truncate text-xl font-bold text-yellow-500 sm:text-2xl">
          {item.name}
        </h2>

        <p className="mt-2">
          NGN {item.price}
        </p>

        <div className="mt-4 flex items-center gap-3">

          <button
            onClick={() => decreaseQty(item._id)}
            className="h-10 w-10 rounded-lg bg-yellow-600 font-bold text-black transition hover:bg-yellow-500"
          >
            -
          </button>

          <span className="min-w-6 text-center font-semibold">{item.quantity}</span>

          <button
            onClick={() => increaseQty(item._id)}
            className="h-10 w-10 rounded-lg bg-yellow-600 font-bold text-black transition hover:bg-yellow-500"
          >
            +
          </button>

        </div>

      </div>

      <button
        onClick={() => removeFromCart(item._id)}
        className="min-h-11 rounded-lg bg-red-600 px-4 font-semibold transition hover:bg-red-500 sm:self-center"
      >
        Remove
      </button>

    </div>
  );
}

export default CartItem;
