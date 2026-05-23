import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function DashboardAnalytics({ orders = [], products = [] }) {
  const totalRevenue = orders
    .filter((order) => order.status === "delivered")
    .reduce((acc, order) => acc + (order.totalPrice || 0), 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const preparingOrders = orders.filter((o) => o.status === "preparing").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  const revenueData = {
    labels: ["Revenue"],
    datasets: [
      {
        label: "Delivered Revenue",
        data: [totalRevenue],
        backgroundColor: "#fbbf24",
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#f8fafc" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#f8fafc" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  const statusData = {
    labels: ["Pending", "Preparing", "Delivered"],
    datasets: [
      {
        data: [pendingOrders, preparingOrders, deliveredOrders],
        backgroundColor: ["#fbbf24", "#f97316", "#10b981"],
        hoverOffset: 8,
      },
    ],
  };

  const statusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#f8fafc",
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-xl font-bold text-yellow-500 sm:text-2xl">
          Analytics
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-yellow-700 bg-[#2c1b12] p-5">
          <h3 className="mb-2 text-sm text-gray-400">Revenue</h3>
          <p className="break-words text-2xl font-bold text-yellow-500 sm:text-3xl">
            NGN {totalRevenue}
          </p>
        </div>

        <div className="rounded-xl border border-yellow-700 bg-[#2c1b12] p-5">
          <h3 className="mb-2 text-sm text-gray-400">Orders</h3>
          <p className="text-2xl font-bold text-yellow-500 sm:text-3xl">
            {totalOrders}
          </p>
        </div>

        <div className="rounded-xl border border-yellow-700 bg-[#2c1b12] p-5">
          <h3 className="mb-2 text-sm text-gray-400">Pending</h3>
          <p className="text-2xl font-bold text-yellow-500 sm:text-3xl">
            {pendingOrders}
          </p>
        </div>

        <div className="rounded-xl border border-yellow-700 bg-[#2c1b12] p-5">
          <h3 className="mb-2 text-sm text-gray-400">Products</h3>
          <p className="text-2xl font-bold text-yellow-500 sm:text-3xl">
            {products.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-yellow-700 bg-[#2c1b12] p-4 sm:p-6">
          <h3 className="mb-4 text-lg font-bold text-yellow-500 sm:text-xl">
            Revenue Analytics
          </h3>
          <div className="h-64 sm:h-80">
            <Bar data={revenueData} options={revenueOptions} />
          </div>
        </div>

        <div className="rounded-xl border border-yellow-700 bg-[#2c1b12] p-4 sm:p-6">
          <h3 className="mb-4 text-lg font-bold text-yellow-500 sm:text-xl">
            Order Status
          </h3>
          <div className="h-64 sm:h-80">
            <Pie data={statusData} options={statusOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAnalytics;

