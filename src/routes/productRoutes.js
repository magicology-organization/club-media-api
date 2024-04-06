const express = require("express");
const productHandler = require("../handlers/productHandler");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/add-product",
  authMiddleware.authenticateToken,
  productHandler.uploadProduct
);

module.exports = router;
