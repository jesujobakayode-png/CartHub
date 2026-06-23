import { useEffect, useState } from "react";
import { FaStore } from "react-icons/fa";
import { Link } from "react-router-dom";

import BackButton from "../components/BackButton";
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
  return vendor?.id || vendor?._id || vendor?.vendorId;
}

function vendorFromProduct(product) {
  if (!product?.vendor) {
    return null;
  }

  if (typeof product.vendor === "string") {
    return {
      id: product.vendorId || product.vendor,
      name: "Vendor",
    };
  }

  return {
    ...product.vendor,
    id: product.vendorId || product.vendor.id || product.vendor._id,
  };
}

function uniqueVendors(vendors) {
  const seen = new Set();

  return vendors.filter((vendor) => {
    const id = getVendorId(vendor)?.toString();

    if (!id || seen.has(id)) {
      return false;
    }

    seen.add(id);
    return true;
  });
}

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVendors = async () => {
    setError("");

    try {
      const res = await API.get("/auth/vendors");
      const vendorList = uniqueVendors(getVendorList(res.data));

      if (vendorList.length > 0) {
        setVendors(vendorList);
        return;
      }

      const productRes = await API.get("/products");
      const products = Array.isArray(productRes.data) ? productRes.data : [];
      setVendors(uniqueVendors(products.map(vendorFromProduct).filter(Boolean)));
    } catch (error) {
      console.log(error);
      try {
        const productRes = await API.get("/products");
        const products = Array.isArray(productRes.data) ? productRes.data : [];
        const vendorsFromProducts = uniqueVendors(products.map(vendorFromProduct).filter(Boolean));
        setVendors(vendorsFromProducts);
        setError(vendorsFromProducts.length ? "" : "Vendors could not be loaded.");
      } catch (fallbackError) {
        console.log(fallbackError);
        setError(error.response?.data?.message || "Vendors could not be loaded.");
        setVendors([]);
      }
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-stone-950">Vendors</h1>
          <BackButton />
        </div>
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
