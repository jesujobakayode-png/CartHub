import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const profileFields = [
  "name",
  "email",
  "role",
  "brandName",
  "phone",
  "address",
  "campus",
  "businessCategory",
  "bio",
  "businessHours",
  "deliveryInfo",
  "logo",
  "socialMedia",
];

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    brandName: user.brandName || "",
    phone: user.phone || "",
    address: user.address || "",
    campus: user.campus || "",
    businessCategory: user.businessCategory || "",
    bio: user.bio || "",
    businessHours: user.businessHours || "",
    deliveryInfo: user.deliveryInfo || "",
    logo: user.logo || "",
    socialMedia: {
      instagram: user.socialMedia?.instagram || "",
      twitter: user.socialMedia?.twitter || "",
      facebook: user.socialMedia?.facebook || "",
      website: user.socialMedia?.website || "",
    },
  };
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : value;
}

function cleanOptionalText(value) {
  const cleaned = cleanText(value);

  return cleaned == null ? "" : cleaned;
}

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: formatUser(user),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const email = cleanText(req.body.email);

    if (Object.prototype.hasOwnProperty.call(req.body, "name") && !cleanText(req.body.name)) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "email") && !email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const emailOwner = await User.findOne({ email });

      if (emailOwner && emailOwner._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    profileFields.forEach((field) => {
      if (field === "role") {
        return;
      }

      if (field === "socialMedia" && req.body.socialMedia) {
        user.socialMedia = {
          instagram: cleanOptionalText(req.body.socialMedia.instagram),
          twitter: cleanOptionalText(req.body.socialMedia.twitter),
          facebook: cleanOptionalText(req.body.socialMedia.facebook),
          website: cleanOptionalText(req.body.socialMedia.website),
        };
        return;
      }

      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        user[field] = cleanOptionalText(req.body[field]);
      }
    });

    const updatedUser = await user.save();

    res.json(formatUser(updatedUser));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};

// Public: list vendors
export const listVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: /^vendor$/i })
      .sort({ brandName: 1, name: 1 })
      .limit(200);

    res.json(vendors.map(formatUser));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public: get vendor by id
export const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user || user.role?.toLowerCase() !== "vendor") {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
