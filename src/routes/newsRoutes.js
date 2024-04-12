const express = require("express");
const NewsHandler = require("../handlers/newsHandler");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/post-news",
  authMiddleware.authenticateToken,
  NewsHandler.postNews
);

router.patch(
  "/update-news/:newsID",
  authMiddleware.authenticateToken,
  NewsHandler.updateNews
);

router.get("/find/:newsID", NewsHandler.getNewsByID);

router.get("/starts-with/:letter", NewsHandler.findNewsByTitleStartingWith);

router.delete(
  "/delete/:newsID",
  authMiddleware.authenticateToken,
  NewsHandler.deleteNews
);

router.get("/index-from/:index", NewsHandler.getSixNews);
router.get("/recent", NewsHandler.getRecentNews);
router.get("/all", NewsHandler.getAllNews);

router.all("/post-news", methodNotAllowedHandler);
router.all("/update-news/:newsID", methodNotAllowedHandler);
router.all("/find/:newsID", methodNotAllowedHandler);
router.all("/starts-with/:letter", methodNotAllowedHandler);
router.all("/delete/:newsID", methodNotAllowedHandler);
router.all("/recent", methodNotAllowedHandler);
router.all("/index-from/:index", methodNotAllowedHandler);
router.all("/all", methodNotAllowedHandler);

function methodNotAllowedHandler(req, res, next) {
  res.status(405).send("Method Not Allowed");
}

module.exports = router;
