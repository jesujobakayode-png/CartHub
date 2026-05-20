import Order from "../models/Order.js";


// CREATE ORDER
export const createOrder = async (
  req,
  res
) => {

  try {

    const { items, totalPrice } =
      req.body;

    const order = await Order.create({
      user: req.user.id,
      items,
      totalPrice,
    });

    res.status(201).json(order);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// GET ALL ORDERS (VENDOR)
export const getOrders = async (
  req,
  res
) => {

  try {

    const orders = await Order.find()
      .populate(
        "user",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// GET MY ORDERS (BUYER)
export const getMyOrders = async (
  req,
  res
) => {

  try {

    const orders = await Order.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE ORDER STATUS
export const updateOrderStatus =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404).json({
          message: "Order not found",
        });
      }

      order.status =
        req.body.status ||
        order.status;

      const updatedOrder =
        await order.save();

      res.json(updatedOrder);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };