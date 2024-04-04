const express = require("express");
const authHandler = require("../handlers/authHandler");

const router = express.Router();

router.post("/login", authHandler.login);

module.exports = router;
