export const vendorOnly = (req, res, next) => {
  if (req.user.role?.toLowerCase() !== "vendor") {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};
