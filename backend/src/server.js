import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = Number(process.env.PORT) || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on port ${port}`);
    });
  })
  .catch((e) => {
    console.error("DB connection failed:", e);
    process.exit(1);
  });
