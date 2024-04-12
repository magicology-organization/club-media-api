const express = require("express");
const NewsHandler = require("../handlers/newsHandler");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/add-product",
  authMiddleware.authenticateToken,
  NewsHandler.postNews
);

router.patch(
  "/update-product/:productId",
  authMiddleware.authenticateToken,
  NewsHandler.updateNews
);

router.get("/:productId", NewsHandler.getNewsByID);

router.get("/starts-with/:letter", NewsHandler.findNewsByTitleStartingWith);

router.delete(
  "/delete/:productId",
  authMiddleware.authenticateToken,
  NewsHandler.deleteNews
);

router.get("/index-from/:index", NewsHandler.getSixNews);
router.get("/recent", NewsHandler.getRecentNews);
router.get("/", NewsHandler.getAllNews);

router.all("/add-product", methodNotAllowedHandler);
router.all("/update-product/:productId", methodNotAllowedHandler);
router.all("/:productId", methodNotAllowedHandler);
router.all("/starts-with/:letter", methodNotAllowedHandler);
router.all("/delete/:productId", methodNotAllowedHandler);
router.all("/recent", methodNotAllowedHandler);
router.all("/index-from/:index", methodNotAllowedHandler);
router.all("/", methodNotAllowedHandler);

function methodNotAllowedHandler(req, res, next) {
  res.status(405).send("Method Not Allowed");
}

module.exports = router;
