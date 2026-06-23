import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        vendor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        status: {
          type: String,
          enum: [
            "pending",
            "preparing",
            "out-for-delivery",
            "delivered",
            "cancelled",
          ],
          default: "pending",
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "preparing",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema
);

export default Order;
