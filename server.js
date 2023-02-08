const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const dbConnect = require("./db");
const app = express();
// routes require
const {
  authRoutes,
  userRoutes,
  expertProfileRoutes,
  depositRoutes,
  widthrawRoutes,
} = require("./routes");

// configuration environment
dotenv.config();

app.use(cors());
app.use(morgan("dev"));

// set public folder
app.use(express.static("public"));

// data extract
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expert-profiles", expertProfileRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/widthraws", widthrawRoutes);

const PORT = process.env.PORT || 5000;

// database connection
dbConnect();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
