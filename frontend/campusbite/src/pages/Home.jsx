import { useEffect, useState } from "react";

import API from "../services/api";

import ProductCard from "../components/ProductCard";

function Home() {

  const [products, setProducts] = useState([]);

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

  return (
    <div>

      <h1 className="text-4xl font-bold text-yellow-500 mb-8">
        Campus Vendor Menu
      </h1>

      {
        products.length === 0 ? (
          <p>No products available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                fetchProducts={fetchProducts}
              />
            ))}

          </div>
        )
      }

    </div>
  );
}

export default Home;
