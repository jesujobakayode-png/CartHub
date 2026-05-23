import { useEffect, useState } from "react";

import API from "../services/api";

function VendorOrders() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);


  const fetchOrders = async () => {

    try {

      const res =
        await API.get("/orders");

      setOrders(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, []);


  const updateStatus = async (
    id,
    status
  ) => {

    try {

      await API.put(
        `/orders/${id}`,
        { status }
      );

      fetchOrders();

    } catch (error) {

      console.log(error);
    }
  };


  if (loading) {

    return (
      <div className="text-white text-2xl">
        Loading orders...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#120b08] text-white p-6">

      <h1 className="text-4xl font-bold text-yellow-500 mb-8">

        Vendor Orders

      </h1>


      {orders.length === 0 ? (

        <div className="bg-[#2c1b12] p-6 rounded-2xl border border-yellow-700">

          No orders yet.

        </div>

      ) : (

        <div className="space-y-6">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-6 shadow-lg"
            >

              {/* TOP */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

                <div>

                  <h2 className="text-2xl font-bold text-yellow-500">

                    Order #{order._id.slice(-6)}

                  </h2>

                  <p className="text-gray-300">

                    Customer:
                    {" "}
                    {order.user?.name}

                  </p>

                  <p className="text-gray-400 text-sm">

                    {order.user?.email}

                  </p>

                </div>


                <div className="flex flex-col gap-3">

                  <span className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-center">

                    NGN {order.totalPrice}

                  </span>


                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }
                    className="bg-[#120b08] border border-yellow-700 rounded-lg px-4 py-2 outline-none"
                  >

                    <option value="pending">
                      Pending
                    </option>

                    <option value="preparing">
                      Preparing
                    </option>

                    <option value="out-for-delivery">
                      Out For Delivery
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>

              </div>


              {/* ITEMS */}
              <div className="space-y-4">

                {order.items.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="flex items-center gap-4 bg-[#1c120d] p-4 rounded-xl"
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <div className="flex-1">

                        <h3 className="font-bold text-lg">

                          {item.name}

                        </h3>

                        <p className="text-gray-400">

                          Quantity:
                          {" "}
                          {item.quantity}

                        </p>

                      </div>

                      <p className="text-yellow-400 font-bold">

                        NGN{" "}
                        {item.price * item.quantity}

                      </p>

                    </div>
                  )
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default VendorOrders;
