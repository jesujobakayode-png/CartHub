function Toast({
  message,
  type,
}) {

  return (
    <div
      className={`fixed top-5 right-5 z-9999
      px-6 py-4 rounded-xl shadow-2xl
      border font-semibold animate-bounce

      ${
        type === "success"
          ? "bg-green-500 text-black border-green-300"
          : "bg-red-500 text-white border-red-300"
      }
      `}
    >

      {message}

    </div>
  );
}

export default Toast;