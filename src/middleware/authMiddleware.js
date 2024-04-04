const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader;
  if (token == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, "hmoms-keys", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.userID = jwt.decode(token, "hmoms-keys");
    next();
  });
};
