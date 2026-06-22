import Product from "../models/Product.js";

export const getVendorProducts =
  async (req, res) => {

    try {

      const products = await Product.find({ vendor: req.user.id }).populate(
        "vendor",
        "name email"
      );

      res.json(products);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("vendor", "name email");

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET SINGLE PRODUCT
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "vendor",
      "name email"
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {

    const product = await Product.create({
      ...req.body,
      vendor: req.user.id,
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// UPDATE PRODUCT
export const updateProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      // OWNER CHECK
      if (
        product.vendor?.toString() !==
        req.user.id
      ) {

        return res.status(403).json({
          message:
            "Not authorized",
        });
      }

      const updatedProduct =
        await Product.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );

      res.json(updatedProduct);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };


// DELETE PRODUCT
export const deleteProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          message: "Product not found",
        });
      }

      // OWNER CHECK
      if (
        product.vendor?.toString() !==
        req.user.id
      ) {

        return res.status(403).json({
          message:
            "Not authorized",
        });
      }

      await product.deleteOne();

      res.json({
        message:
          "Product deleted",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };
