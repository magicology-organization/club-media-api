const express = require("express");
const authHandler = require("../handlers/authEmployeeHandler");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", authHandler.login);
router.post(
  "/change-password",
  authMiddleware.authenticateToken,
  authHandler.changePassword
);

router.all("/login", methodNotAllowedHandler);
router.all("/change-password", methodNotAllowedHandler);

function methodNotAllowedHandler(req, res, next) {
  res.status(405).send("Method Not Allowed");
}

module.exports = router;
