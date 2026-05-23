import mongoose from "mongoose";

const productSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      category: {
        type: String,
      },

      description: {
        type: String,
      },

      image: {
        type: String,
      },

      // NEW
      vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },

    {
      timestamps: true,
    }
  );

const Product =
  mongoose.model(
    "Product",
    productSchema
  );

export default Product;