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
