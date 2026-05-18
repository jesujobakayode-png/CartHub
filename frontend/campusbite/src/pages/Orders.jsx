import { useEffect, useState } from "react";

import API from "../services/api";

function Orders() {

  const [orders, setOrders] = useState([]);


  const fetchOrders = async () => {

    try {

      const res = await API.get("/orders");

      setOrders(res.data);

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, []);


  return (
    <div>

      <h1 className="text-4xl font-bold text-yellow-500 mb-8">
        Orders
      </h1>

      <div className="space-y-6">

        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-[#2c1b12] border border-yellow-700 rounded-2xl p-6"
          >

            <div className="flex flex-col sm:flex-row sm:justify-between mb-5 gap-2">

              <h2 className="text-2xl font-bold text-yellow-500">
                {order.status}
              </h2>

              <p>
                NGN {order.totalPrice}
              </p>

            </div>

            <div className="space-y-3">

              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row sm:justify-between gap-2"
                >
                  <p>
                    {item.name} x {item.quantity}
                  </p>

                  <p>
                    NGN {item.price * item.quantity}
                  </p>
                </div>
              ))}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Orders;
