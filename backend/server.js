const express = require("express");
require("dotenv").config();
const bodyParser = require('body-parser')
const cors = require("cors");
const userRoutes  = require('./src/routes/Routes.js')

const app = express();
const port = process.env.PORT;
const corsOptions = { origin: "*" };

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use('/api/users', userRoutes)
app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
