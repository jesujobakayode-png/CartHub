import { useCallback, useContext, useEffect, useState } from "react";
import { Navigate, NavLink, useNavigate, useParams } from "react-router-dom";

import DashboardAnalytics from "../components/DashboardAnalytics";
import ProductCard from "../components/ProductCard";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import API from "../services/api";
import { onEvent, offEvent } from "../utils/socket";
import Notifications from "./Notifications";

const emptyForm = {
  name: "",
  price: "",
  category: "",
  description: "",
  image: "",
};

const vendorPages = ["dashboard", "menu", "orders", "analytics", "products", "notifications"];

const orderClasses = [
  { key: "all", label: "All", statuses: [] },
  { key: "pending", label: "Pending", statuses: ["pending"] },
  { key: "in-progress", label: "In Progress", statuses: ["preparing", "out-for-delivery"] },
  { key: "completed", label: "Completed", statuses: ["delivered"] },
  { key: "cancelled", label: "Cancelled", statuses: ["cancelled"] },
];

const statusStyles = {
  pending: "border-amber-200 bg-amber-100 text-amber-700",
  preparing: "border-blue-200 bg-blue-100 text-blue-700",
  "out-for-delivery": "border-violet-200 bg-violet-100 text-violet-700",
  delivered: "border-emerald-200 bg-emerald-100 text-emerald-700",
  cancelled: "border-red-200 bg-red-100 text-red-700",
};

function getVendorItems(order, userId) {
  const items = Array.isArray(order.items) ? order.items : [];

  if (!userId) {
    return [];
  }

  return items.filter((item) => {
    const vendorId = typeof item.vendor === "string" ? item.vendor : item.vendor?._id;
    return vendorId === userId;
  });
}

function getOrderStatus(order) {
  return order.vendorStatus || order.items?.[0]?.status || order.status || "pending";
}

function orderMatchesSearch(order, vendorItems, searchTerm) {
  const needle = searchTerm.trim().toLowerCase();

  if (!needle) {
    return true;
  }

  const searchable = [
    order._id,
    getOrderStatus(order),
    order.user?.name,
    order.user?.email,
    ...vendorItems.map((item) => item.name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(needle);
}

function getCurrentUserId(user) {
  return user?.id || user?._id || user?.user?.id || user?.user?._id;
}

function getCurrentUserRole(user) {
  return user?.role || user?.user?.role;
}

function getProductVendorId(product) {
  const vendorId = typeof product.vendor === "string" ? product.vendor : product.vendor?._id;

  return vendorId?.toString();
}

function VendorDashboard() {
  const { section } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const actualRole = getCurrentUserRole(user);
  const currentUserId = getCurrentUserId(user);

  const activePage = section || "dashboard";
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [orderClass, setOrderClass] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [submittedOrderSearch, setSubmittedOrderSearch] = useState("");

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError("");

    try {
      const res = await API.get("/products/vendor/my-products");
      const productList = Array.isArray(res.data) ? res.data : res.data?.value;

      setProducts(Array.isArray(productList) ? productList : []);
    } catch (error) {
      console.log(error);
      try {
        const res = await API.get("/products");
        const productList = Array.isArray(res.data) ? res.data : [];
        setProducts(
          productList.filter((product) => getProductVendorId(product) === currentUserId?.toString())
        );
      } catch (fallbackError) {
        console.log(fallbackError);
        setProductsError("Products could not be refreshed. Your existing list was kept.");
      }
    } finally {
      setProductsLoading(false);
    }
  }, [currentUserId]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get("/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    if (actualRole !== "vendor") {
      return;
    }

    fetchProducts();
    fetchOrders();

    const handleNew = (order) => {
      setOrders((prev) => [order, ...prev.filter((item) => item._id !== order._id)]);
      if (showToast) showToast({ message: "New order received", type: "success" });
    };

    const handleUpdate = (order) => {
      if (showToast) showToast({ message: `Order ${order._id.slice(-6)} updated`, type: "info" });
      setOrders((prev) =>
        prev.map((item) => (item._id === order._id ? order : item))
      );
    };

    onEvent("newOrder", handleNew);
    onEvent("orderUpdated", handleUpdate);

    return () => {
      offEvent("newOrder", handleNew);
      offEvent("orderUpdated", handleUpdate);
    };
  }, [actualRole, fetchOrders, fetchProducts, showToast]);

  if (!vendorPages.includes(activePage)) {
    return <Navigate to="/vendor-dashboard" replace />;
  }

  if (actualRole !== "vendor") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-stone-950">
        <div className="w-full max-w-md rounded-xl border border-stone-300 bg-[#fbfaf7] p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-stone-950">Access Denied</h1>
        </div>
      </div>
    );
  }

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price || 0),
    0
  );
  const pendingOrders = orders.filter((order) => getOrderStatus(order) === "pending").length;
  const activeOrderClass = orderClasses.find((item) => item.key === orderClass);
  const visibleOrders = orders.filter((order) => {
    const vendorItems = getVendorItems(order, currentUserId);
    const matchesClass =
      !activeOrderClass?.statuses.length || activeOrderClass.statuses.includes(getOrderStatus(order));

    return matchesClass && orderMatchesSearch(order, vendorItems, submittedOrderSearch);
  });

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });
      fetchOrders();
      if (showToast) {
        showToast({
          message: `Order ${id.slice(-6)} is now ${status.replaceAll("-", " ")}`,
          type: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingProductId(null);
  };

  const startEdit = (product) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      description: product.description || "",
      image: product.image || "",
    });
    navigate("/vendor-dashboard/menu");
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "campusbite");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dcptr9k9n/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      setFormData((prev) => ({
        ...prev,
        image: result.secure_url,
      }));
    } catch (error) {
      console.log("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.description ||
      !formData.image
    ) {
      return;
    }

    try {
      if (editingProductId) {
        const res = await API.put(`/products/${editingProductId}`, formData);
        const updatedProduct = res.data;
        if (updatedProduct?._id) {
          setProducts((prev) =>
            prev.map((product) =>
              product._id === updatedProduct._id ? updatedProduct : product
            )
          );
        }
        if (showToast) {
          showToast({ message: "Product updated successfully", type: "success" });
        }
      } else {
        const res = await API.post("/products", formData);
        const createdProduct = res.data;
        if (createdProduct?._id) {
          setProducts((prev) => [
            createdProduct,
            ...prev.filter((product) => product._id !== createdProduct._id),
          ]);
        }
        if (showToast) {
          showToast({ message: "Product added successfully", type: "success" });
        }
      }

      resetForm();
      await fetchProducts();
      navigate("/vendor-dashboard/products");
    } catch (error) {
      console.log(error);
    }
  };

  const navItems = [
    { label: "Dashboard", path: "/vendor-dashboard" },
    { label: "Listings", path: "/vendor-dashboard/menu" },
    { label: "Orders", path: "/vendor-dashboard/orders" },
    { label: "Notifications", path: "/vendor-dashboard/notifications" },
    { label: "Profile", path: "/vendor-profile" },
    { label: "Analytics", path: "/vendor-dashboard/analytics" },
    { label: "Products", path: "/vendor-dashboard/products" },
  ];

  const metricCards = [
    { label: "Products", value: totalProducts },
    { label: "Inventory Value", value: `NGN ${totalValue}` },
    { label: "Pending Orders", value: pendingOrders },
  ];

  const renderPage = () => {
    if (activePage === "menu") {
      return (
        <section className="rounded-2xl border border-stone-300 bg-[#fbfaf7] p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-stone-950">
              {editingProductId ? "Edit Product" : "Add Product"}
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Keep names, pricing, images, and descriptions ready for shoppers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="min-h-12 w-full rounded-lg border border-stone-200 bg-stone-50 p-3 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="min-h-12 w-full rounded-lg border border-stone-200 bg-stone-50 p-3 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="min-h-12 w-full rounded-lg border border-stone-200 bg-stone-50 p-3 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />

            <div className="md:row-span-2">
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Product image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={uploadImage}
                className="min-h-12 w-full rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-amber-500 file:px-3 file:py-2 file:font-semibold file:text-black"
              />

              {!formData.image && (
                <div className="mt-3 flex aspect-video w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 px-4 text-center">
                  <span className="text-sm font-semibold text-stone-700">
                    Product image upload
                  </span>
                  <span className="mt-1 text-xs leading-5 text-stone-500">
                    Add the product photo shoppers will see in your listing.
                  </span>
                </div>
              )}

              {uploading && (
                <p className="mt-2 text-sm font-semibold text-amber-700">Uploading...</p>
              )}

              {formData.image && (
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="mt-3 aspect-video w-full rounded-lg border border-stone-200 object-cover"
                />
              )}
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="min-h-32 w-full rounded-lg border border-stone-200 bg-stone-50 p-3 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />

            <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
              <button className="min-h-12 rounded-lg border border-amber-500 bg-amber-500 px-5 py-3 font-bold text-black transition hover:bg-amber-400 sm:flex-1">
                {editingProductId ? "Update Product" : "Add Product"}
              </button>
              {editingProductId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="min-h-12 rounded-lg border border-stone-300 bg-[#fbfaf7] px-5 py-3 font-semibold text-stone-700 transition hover:bg-stone-100 sm:flex-1"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>
      );
    }

    if (activePage === "orders") {
      return (
        <section className="space-y-4">
          <PageTitle title="Orders" subtitle="Review incoming shopper orders." />

          <div className="rounded-2xl border border-stone-300 bg-[#fbfaf7] p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap gap-2">
              {orderClasses.map((item) => {
                const count = item.statuses.length
                  ? orders.filter((order) => item.statuses.includes(getOrderStatus(order))).length
                  : orders.length;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setOrderClass(item.key)}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      orderClass === item.key
                        ? "border-amber-500 bg-amber-500 text-black"
                        : "border-stone-300 bg-white text-stone-700 hover:border-amber-300 hover:bg-amber-50"
                    }`}
                  >
                    {item.label} ({count})
                  </button>
                );
              })}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmittedOrderSearch(orderSearch);
              }}
              className="mt-4 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="search"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search order ID, shopper, email, item, or status"
                className="min-h-11 flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
              />
              <button
                type="submit"
                className="min-h-11 rounded-lg border border-amber-500 bg-amber-500 px-5 py-2 text-sm font-bold text-black transition hover:bg-amber-400"
              >
                Search
              </button>
            </form>
          </div>

          {orders.length === 0 ? (
            <EmptyPanel>No orders yet.</EmptyPanel>
          ) : visibleOrders.length === 0 ? (
            <EmptyPanel>No orders match your filter or search.</EmptyPanel>
          ) : (
            visibleOrders.map((order) => {
              const vendorItems = getVendorItems(order, currentUserId);
              const orderStatus = getOrderStatus(order);
              const sellerTotal = vendorItems.reduce(
                (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
                0
              );

              return (
                <div
                  key={order._id}
                  className="rounded-2xl border border-stone-300 bg-[#fbfaf7] p-4 shadow-sm sm:p-5"
                >
                  <div className="flex flex-col gap-4 border-b border-stone-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
                        Order #{order._id.slice(-6)}
                      </p>
                      <p className="mt-1 text-lg font-bold text-stone-950">
                        {order.user?.name || "Shopper"}
                      </p>
                      <p className="text-sm text-stone-600">{order.user?.email || "No email"}</p>
                      <p className="mt-1 text-xs text-stone-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold capitalize ${
                          statusStyles[orderStatus] || "border-stone-200 bg-stone-100 text-stone-700"
                        }`}
                      >
                        {orderStatus.replaceAll("-", " ")}
                      </span>
                      <select
                        value={orderStatus}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="min-h-10 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="out-for-delivery">Out For Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="mb-3 text-sm font-semibold uppercase text-stone-700">
                      Seller Items ({vendorItems.length})
                    </p>
                    <div className="space-y-3">
                      {vendorItems.map((item, index) => (
                        <div
                          key={`${item.productId || item.name}-${index}`}
                          className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-14 w-14 rounded-lg border border-stone-200 object-cover"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-stone-950">{item.name}</p>
                              <p className="text-sm text-stone-600">
                                Qty {item.quantity} x NGN {item.price}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-stone-950">
                            NGN {Number(item.price || 0) * Number(item.quantity || 0)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm sm:grid-cols-3">
                    <div>
                      <span className="block text-stone-500">Seller Total</span>
                      <span className="font-bold text-stone-950">NGN {sellerTotal}</span>
                    </div>
                    <div>
                      <span className="block text-stone-500">Items</span>
                      <span className="font-semibold text-stone-950">
                        {vendorItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-stone-500">Full Order Total</span>
                      <span className="font-semibold text-stone-950">NGN {order.totalPrice}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      );
    }

    if (activePage === "notifications") {
      return (
        <section className="space-y-4">
          <PageTitle title="Notifications" subtitle="Keep track of buyer and seller updates." />
          <Notifications />
        </section>
      );
    }

    if (activePage === "analytics") {
      return (
        <section className="space-y-4">
          <PageTitle title="Analytics" subtitle="Track revenue, order status, and listing volume." />
          <DashboardAnalytics orders={orders} products={products} />
        </section>
      );
    }

    if (activePage === "products") {
      return (
        <section className="space-y-4">
          <PageTitle title="Products" subtitle="Review and update items shown to shoppers." />
          {productsError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {productsError}
            </div>
          )}
          {productsLoading ? (
            <EmptyPanel>Loading products...</EmptyPanel>
          ) : products.length === 0 ? (
            <EmptyPanel>No products added yet.</EmptyPanel>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isVendor
                  onEdit={startEdit}
                  fetchProducts={fetchProducts}
                />
              ))}
            </div>
          )}
        </section>
      );
    }

    return (
      <section className="space-y-6">
        <PageTitle title="Vendor Dashboard" subtitle="Manage your listings, orders, and performance." />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {metricCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-stone-300 bg-[#fbfaf7] p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-stone-500">{card.label}</p>
              <p className="mt-2 wrap-break-word text-2xl font-bold text-stone-950">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <NavLink
            to="/vendor-dashboard/menu"
            className="rounded-2xl border border-stone-300 bg-[#fbfaf7] p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <h3 className="text-xl font-bold text-stone-950">Add a listing</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Upload a product photo, set price, and publish it to shoppers.
            </p>
          </NavLink>

          <NavLink
            to="/vendor-dashboard/products"
            className="rounded-2xl border border-stone-300 bg-[#fbfaf7] p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <h3 className="text-xl font-bold text-stone-950">Manage products</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Edit pricing, descriptions, and availability from one page.
            </p>
          </NavLink>

          <NavLink
            to="/vendor-profile"
            className="rounded-2xl border border-stone-300 bg-[#fbfaf7] p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <h3 className="text-xl font-bold text-stone-950">Seller Profile</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Update your store bio, contact details, hours, and delivery options.
            </p>
          </NavLink>
        </div>
      </section>
    );
  };

  return (
    <div className="lg:-mx-4 lg:-my-6">
      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        <aside className="sticky top-22 z-30 -mx-3 border-y border-stone-300 bg-[#eef1f4]/95 px-3 py-3 backdrop-blur sm:-mx-4 sm:px-4 lg:top-24 lg:mx-0 lg:h-fit lg:rounded-2xl lg:border lg:bg-[#fbfaf7] lg:p-4 lg:shadow-sm">
          <h1 className="mb-3 hidden px-2 text-lg font-bold text-stone-950 lg:block">
            Vendor Panel
          </h1>

          <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/vendor-dashboard"}
                className={({ isActive }) =>
                  `shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition lg:block lg:w-full ${
                    isActive
                      ? "border-amber-500 bg-amber-500 text-black"
                      : "border-stone-300 bg-[#fbfaf7] text-stone-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 pb-8">{renderPage()}</main>
      </div>
    </div>
  );
}

function PageTitle({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-stone-300 bg-[#fbfaf7] p-5 shadow-sm sm:p-6">
      <h2 className="text-2xl font-bold text-stone-950 sm:text-3xl">{title}</h2>
      <p className="mt-1 text-sm text-stone-600">{subtitle}</p>
    </div>
  );
}

function EmptyPanel({ children }) {
  return (
    <div className="rounded-2xl border border-stone-300 bg-[#fbfaf7] p-6 text-stone-600 shadow-sm">
      {children}
    </div>
  );
}

export default VendorDashboard;
