import { useEffect, useState } from "react";
import { FaStore } from "react-icons/fa";
import { Link } from "react-router-dom";

import API from "../services/api";

function getVendorList(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.vendors)) {
    return data.vendors;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.value)) {
    return data.value;
  }

  return [];
}

function getVendorId(vendor) {
  return vendor?.id || vendor?._id;
}

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVendors = async () => {
    setError("");

    try {
      const res = await API.get("/auth/vendors");
      setVendors(getVendorList(res.data).filter(getVendorId));
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Vendors could not be loaded.");
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
        <p className="mt-1 text-sm text-stone-600">
          Browse local sellers and view their public storefronts.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-stone-200 bg-white/80 p-8 text-center text-stone-700 shadow-sm">
          Loading vendors...
        </div>
      ) : vendors.length === 0 ? (
        <div className="rounded-3xl border border-stone-300 bg-[#fbfaf7] p-8 text-center text-stone-700 shadow-sm">
          {error || "No vendors found."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => {
            const vendorId = getVendorId(vendor);
            const displayName = vendor.brandName || vendor.name || "Vendor";

            return (
              <Link
                key={vendorId}
                to={`/vendor/${vendorId}`}
                className="overflow-hidden rounded-xl border border-stone-300 bg-[#fbfaf7] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                    {vendor.logo ? (
                      <img
                        src={vendor.logo}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl text-amber-600">
                        <FaStore />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold text-stone-950">{displayName}</p>
                    <p className="mt-1 text-sm text-stone-600">
                      {vendor.businessCategory || "General"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Vendors;
