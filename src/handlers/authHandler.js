const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EmploymentLogin = require("../models/EmploymentLogin");

const generateToken = (user) => {
  return jwt.sign({ userId: user.EmploymentID }, "your_secret_key", {
    expiresIn: "3d",
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const employment = await EmploymentLogin.findByUsername(username);
    if (!employment) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const validate = await EmploymentLogin.comparePassword(
      password,
      employment.LoginPassword
    );

    if (!validate) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = generateToken(employment);
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
