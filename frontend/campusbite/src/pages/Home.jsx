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
      <div className="mb-8 sm:mb-10">
        <h1 className="mb-3 text-3xl font-bold text-yellow-500 sm:text-4xl">
          Campus Vendor Menu
        </h1>

        <p className="text-gray-300">Discover delicious meals around campus</p>
      </div>

      <div className="mb-5 sm:mb-6">
        <input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-12 w-full rounded-xl border border-yellow-700 bg-[#2c1b12] px-4 py-3 outline-none transition focus:border-yellow-500 sm:px-5 sm:py-4"
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
                ? "bg-yellow-500 text-black border-yellow-500"
                : "bg-[#2c1b12] text-yellow-500 border-yellow-700 hover:bg-yellow-500 hover:text-black"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-yellow-700 bg-[#2c1b12] p-8 text-center shadow-2xl sm:p-12">
          <div className="mb-5 text-4xl font-bold text-yellow-500 sm:text-5xl">
            Meals
          </div>

          <h2 className="mb-3 text-2xl font-bold text-yellow-500 sm:text-3xl">
            No Meals Found
          </h2>

          <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
            We could not find any meals matching your search. Try another
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
