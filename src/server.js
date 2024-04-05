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

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Check if the request is attempting to redirect
  if (req.url === "/" || req.url === "/api") {
    // Handle the redirect request
    res.status(403).send("Redirects are not allowed");
  } else {
    // Continue to the next middleware or route handler
    next();
  }
});
app.use("/api/auth", authEmployeeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
