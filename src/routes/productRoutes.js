const express = require("express");
const ProductHandler = require("../handlers/productHandler");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/add-product",
  authMiddleware.authenticateToken,
  ProductHandler.uploadProduct
);

router.patch(
  "/update-product/:productId",
  authMiddleware.authenticateToken,
  ProductHandler.updateProduct
);

router.get("/:productId", ProductHandler.getProductByID);

router.get(
  "/starts-with/:letter",
  ProductHandler.findProductsByNameStartingWith
);

router.delete(
  "/delete/:productId",
  authMiddleware.authenticateToken,
  ProductHandler.deleteProduct
);

router.get("/", ProductHandler.getAllProducts);

router.all("/add-product", methodNotAllowedHandler);
router.all("/update-product/:productId", methodNotAllowedHandler);
router.all("/:productId", methodNotAllowedHandler);
router.all("/starts-with/:letter", methodNotAllowedHandler);
router.all("/delete/:productId", methodNotAllowedHandler);
router.all("/", methodNotAllowedHandler);

function methodNotAllowedHandler(req, res, next) {
  res.status(405).send("Method Not Allowed");
}

module.exports = router;
