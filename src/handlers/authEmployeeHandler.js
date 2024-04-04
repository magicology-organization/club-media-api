const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EmploymentLogin = require("../models/EmploymentLogin");

const generateToken = (user) => {
  return jwt.sign({ userId: user.EmploymentID }, "hmoms-keys", {
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

exports.changePassword = async (req, res) => {
  const employmentID = req.userID.userId;
  const { currentPassword, newPassword } = req.body;
  // console.log(employmentID.userId);
  try {
    const employment = await EmploymentLogin.findByID(employmentID);

    if (!employment) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const validate = await EmploymentLogin.comparePassword(
      currentPassword,
      employment.LoginPassword
    );

    if (!validate) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await EmploymentLogin.updatePassword(employmentID, hashedNewPassword);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
