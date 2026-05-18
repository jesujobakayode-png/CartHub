function CartItem({
  item,
  removeFromCart,
  increaseQty,
  decreaseQty,
}) {

  return (
    <div className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-4 flex flex-col md:flex-row gap-4">

      <img
        src={item.image}
        alt={item.name}
        className="w-full md:w-28 h-28 object-cover rounded-xl"
      />

      <div className="flex-1">

        <h2 className="text-2xl font-bold text-yellow-500">
          {item.name}
        </h2>

        <p className="mt-2">
          NGN {item.price}
        </p>

        <div className="flex items-center gap-3 mt-4">

          <button
            onClick={() => decreaseQty(item._id)}
            className="bg-yellow-600 w-8 h-8 rounded-lg"
          >
            -
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() => increaseQty(item._id)}
            className="bg-yellow-600 w-8 h-8 rounded-lg"
          >
            +
          </button>

        </div>

      </div>

      <button
        onClick={() => removeFromCart(item._id)}
        className="bg-red-600 px-4 rounded-lg self-start md:self-auto"
      >
        Remove
      </button>

    </div>
  );
}

export default CartItem;
