import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      const res = await API.get("/auth/vendors");
      setVendors(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-stone-300 bg-[#fbfaf7] p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-stone-950">Vendors</h1>
        <p className="mt-1 text-sm text-stone-600">Browse local sellers and view their public storefronts.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-stone-200 bg-white/80 p-8 text-center text-stone-700 shadow-sm">
          Loading vendors...
        </div>
      ) : vendors.length === 0 ? (
        <div className="rounded-3xl border border-stone-300 bg-[#fbfaf7] p-8 text-center text-stone-700 shadow-sm">
          No vendors found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((v) => (
            <Link
              key={v.id}
              to={`/vendor/${v.id}`}
              className="overflow-hidden rounded-xl border border-stone-300 bg-[#fbfaf7] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                  {v.logo ? (
                    <img src={v.logo} alt={v.brandName || v.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-amber-600">🏬</div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-stone-950">{v.brandName || v.name}</p>
                  <p className="mt-1 text-sm text-stone-600">{v.businessCategory || "General"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Vendors;
