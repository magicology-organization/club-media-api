const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./config/dbConfig");

const app = express();

//deployment dependencies
// const helmet = require("helmet");
// app.use(helmet());

//dev dependencies
const cors = require("cors");
app.use(cors());

// avoid being attacked by common HTTP
app.disable("x-powered-by");
// reduce fingerprints

//routes defines (to be seperated)
const authEmployeeRoutes = require("./routes/authAdminRoutes");
const newsRoutes = require("./routes/newsRoutes");

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
app.use("/api/news", newsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Default region in the cloud: " + process.env.DEFAULT_REGION_AWS);
});
