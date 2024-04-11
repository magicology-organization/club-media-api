const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const AdminLogin = require("../models/AdminLogin");

class AuthHandler {
  static generateToken(user) {
    return jwt.sign({ userId: user.AdminID }, process.env.ADMIN_JWT_KEY, {
      expiresIn: "3d",
    });
  }

  static async login(req, res) {
    const { username, password } = req.body;
    try {
      const admin = await AdminLogin.findByUsername(username);

      if (!admin) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
      const validate = await AdminLogin.comparePassword(
        password,
        admin.LoginPassword
      );

      if (!validate) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const token = AuthHandler.generateToken(admin);
      res.json({ token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async changePassword(req, res) {
    const AdminID = req.userID.userId;
    const { currentPassword, newPassword } = req.body;
    try {
      const admin = await AdminLogin.findByID(AdminID);

      if (!admin) {
        return res.status(404).json({ message: "User does not exist" });
      }

      const validate = await AdminLogin.comparePassword(
        currentPassword,
        admin.LoginPassword
      );

      if (!validate) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await AdminLogin.updatePassword(AdminID, hashedNewPassword);
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = AuthHandler;
