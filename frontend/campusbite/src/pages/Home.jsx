import { useEffect, useMemo, useState } from "react";

import ProductCard from "../components/ProductCard";
import API from "../services/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      const productList = Array.isArray(res.data) ? res.data : res.data?.value;

      setProducts(Array.isArray(productList) ? productList : []);
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const productCategories = products
      .map((product) => product.category)
      .filter(Boolean);

    return ["All", ...new Set(productCategories)];
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const productName = product.name || "";
    const productCategory = product.category || "";

    const matchesSearch = productName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || productCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-stone-300 bg-[#fbfaf7] p-5 shadow-sm sm:mb-8 sm:p-6">
        <h1 className="mb-3 text-3xl font-bold text-stone-950 sm:text-4xl">
          Campus Marketplace
        </h1>

        <p className="text-gray-700">Discover useful products and services around campus</p>
      </div>

      <div className="mb-5 rounded-2xl border border-stone-300 bg-[#fbfaf7] p-3 shadow-sm sm:mb-6 sm:p-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100 sm:px-5 sm:py-4"
        />
      </div>

      <div className="-mx-3 mb-8 flex gap-2 overflow-x-auto px-3 pb-2 sm:mx-0 sm:flex-wrap sm:gap-3 sm:px-0">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition sm:px-5 ${
              selectedCategory === category
                ? "bg-amber-500 text-black border-amber-500"
                : "bg-[#fbfaf7] text-amber-700 border-stone-300 hover:bg-amber-500 hover:text-black"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-stone-300 bg-[#fbfaf7] p-8 text-center shadow-sm sm:p-12">
          <div className="mb-5 text-4xl font-bold text-amber-700 sm:text-5xl">
            Products
          </div>

          <h2 className="mb-3 text-2xl font-bold text-stone-950 sm:text-3xl">
            No Products Found
          </h2>

          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            We could not find any products matching your search. Try another
            keyword or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              fetchProducts={fetchProducts}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
