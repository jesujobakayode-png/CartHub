import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function BackButton({ fallback = "/", label = "Back" }) {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallback);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-stone-300 bg-[#fbfaf7] px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
    >
      <FaArrowLeft />
      {label}
    </button>
  );
}

export default BackButton;
