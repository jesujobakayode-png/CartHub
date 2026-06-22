import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { getIo } from "../utils/socket.js";


// CREATE ORDER
export const createOrder = async (
  req,
  res
) => {

  try {

    const { items = [], totalPrice } = req.body;

    // enrich items with productId and vendor (if productId provided)
    const enrichedItems = await Promise.all(
      items.map(async (it) => {
        if (it.productId) {
          try {
            const product = await Product.findById(it.productId);
            return {
              productId: it.productId,
              vendor: product?.vendor || undefined,
              name: it.name,
              price: it.price,
              quantity: it.quantity,
              image: it.image,
            };
          } catch (err) {
            return {
              name: it.name,
              price: it.price,
              quantity: it.quantity,
              image: it.image,
            };
          }
        }

        return {
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          image: it.image,
        };
      })
    );

    const createdOrder = await Order.create({
      user: req.user.id,
      items: enrichedItems,
      totalPrice,
    });

    const order = await Order.findById(createdOrder._id)
      .populate("user", "name email")
      .populate("items.vendor", "name email");

    // Emit real-time events
    const io = getIo();

    // notify buyer
    io?.to(`user_${req.user.id}`).emit("orderCreated", order);

    // notify vendors involved
    const vendorIds = Array.from(
      new Set(enrichedItems.map((it) => it.vendor).filter(Boolean))
    );

    vendorIds.forEach((vid) => {
      io?.to(`vendor_${vid}`).emit("newOrder", order);
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

    // only return orders that involve this vendor
    const orders = await Order.find({ "items.vendor": req.user.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

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

    const orders = await Order.find({ user: req.user.id })
      .populate("items.vendor", "name email")
      .sort({ createdAt: -1 });

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

      const vendorOwnsOrder = order.items.some(
        (item) => item.vendor?.toString() === req.user.id
      );

      if (!vendorOwnsOrder) {
        return res.status(403).json({
          message: "You can only update orders that include your products",
        });
      }

      order.status = req.body.status || order.status;

      await order.save();

      const updatedOrder = await Order.findById(order._id)
        .populate("user", "name email")
        .populate("items.vendor", "name email");

      // emit updates to buyer and vendors
      const io = getIo();

      io?.to(`user_${order.user.toString()}`).emit("orderUpdated", updatedOrder);

      const vendorIds = Array.from(
        new Set(order.items.map((it) => it.vendor?.toString()).filter(Boolean))
      );

      vendorIds.forEach((vid) => {
        io?.to(`vendor_${vid}`).emit("orderUpdated", updatedOrder);
      });

      res.json(updatedOrder);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };
