const express = require("express");
const AuthHandler = require("../handlers/authAdminHandler");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", AuthHandler.login);
router.put(
  "/change-password",
  authMiddleware.authenticateToken,
  AuthHandler.changePassword
);

router.all("/login", methodNotAllowedHandler);
router.all("/change-password", methodNotAllowedHandler);

function methodNotAllowedHandler(req, res, next) {
  res.status(405).send("Method Not Allowed");
}

module.exports = router;
