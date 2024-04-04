const bcrypt = require("bcrypt");
const connection = require("../config/dbConfig");

const EmploymentLogin = {};

EmploymentLogin.findByUsername = async (username) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM Employment WHERE LoginUsername = ?",
      [username],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result[0]);
      }
    );
  });
};

EmploymentLogin.comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = EmploymentLogin;
