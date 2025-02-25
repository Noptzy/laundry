const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./users/routes/usersRoutes.js");
const app = express();

const corsOptions = {
  origin: "http://localhost:5000",
};

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users", userRoutes);

module.exports = app;
