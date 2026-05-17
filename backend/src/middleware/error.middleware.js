export function errorHandler(err, req, res, next) {
  console.error(err);

  // Mongo duplicate key error
  if (err?.code === 11000) {
    return res.status(409).json({ message: "Duplicate key", details: err.keyValue });
  }

  const isProd = process.env.NODE_ENV === "production";
  const message = isProd ? "Internal server error" : (err?.message || "Internal server error");

  res.status(500).json({ message });
}
