const express = require("express");
const productHandler = require("../handlers/productHandler");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/add-product",
  authMiddleware.authenticateToken,
  productHandler.uploadProduct
);

router.patch(
  "/update-product/:productId",
  authMiddleware.authenticateToken,
  productHandler.updateProduct
);

router.get("/:productId", productHandler.getProductByID);

router.get(
  "/starts-with/:letter",
  productHandler.findProductsByNameStartingWith
);

router.delete(
  "/delete/:productId",
  authMiddleware.authenticateToken,
  productHandler.deleteProduct
);

router.get("/", productHandler.getAllProducts);
module.exports = router;
