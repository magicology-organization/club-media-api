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

module.exports = router;
