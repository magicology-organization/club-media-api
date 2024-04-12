const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./config/dbConfig");
const helmet = require("helmet");

const app = express();
app.use(helmet());
// avoid being attacked by common HTTP
app.disable("x-powered-by");
// reduce fingerprints

//routes defines (to be seperated)
const authEmployeeRoutes = require("./routes/authEmployeeRoutes");
const productRoutes = require("./routes/productRoutes");

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  if (req.url === "/" || req.url === "/api") {
    res.status(403).send("Redirects are not allowed");
  } else {
    next();
  }
});

app.use("/api/auth", authEmployeeRoutes);
app.use("/api/products", productRoutes);

module.exports = app;
