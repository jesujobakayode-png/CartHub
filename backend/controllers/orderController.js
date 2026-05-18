import Order from "../models/Order.js";


// CREATE ORDER
export const createOrder = async (req, res) => {
  try {

    const order = await Order.create(req.body);

    res.status(201).json(order);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// GET ORDERS
export const getOrders = async (req, res) => {
  try {

    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};