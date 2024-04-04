const bcrypt = require("bcrypt");
const connection = require("../config/dbConfig");

const EmploymentLogin = {};

EmploymentLogin.findByUsername = async (username, tableName = "Employment") => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM ${tableName} WHERE LoginUsername = ?`,
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

EmploymentLogin.findByID = async (id, tableName = "Employment") => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM ${tableName} WHERE EmploymentID = ?`,
      [id],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result[0]);
      }
    );
  });
};

EmploymentLogin.updatePassword = async (
  userId,
  hashedNewPassword,
  tableName = "Employment"
) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE ${tableName} SET LoginPassword = ? WHERE EmploymentID = ?`,
      [hashedNewPassword, userId],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
};

module.exports = EmploymentLogin;
