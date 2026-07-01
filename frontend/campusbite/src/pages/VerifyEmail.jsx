import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import API from "../services/api";

function VerifyEmail() {
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = routeToken || searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const res = await API.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
        setStatus("success");
        setMessage(res.data?.message || "Email verified successfully.");
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-stone-300 bg-[#fbfaf7] p-6 text-center shadow-sm sm:p-8">
      <h1 className="mb-3 text-3xl font-bold text-stone-950">
        {status === "success" ? "Email Verified" : status === "error" ? "Verification Failed" : "Checking Link"}
      </h1>

      <p className="mb-6 text-stone-600">{message}</p>

      {status !== "loading" && (
        <Link
          to="/login"
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-amber-500 bg-amber-500 px-5 py-3 font-bold text-black transition hover:bg-amber-400"
        >
          Go to Login
        </Link>
      )}
    </div>
  );
}

export default VerifyEmail;
