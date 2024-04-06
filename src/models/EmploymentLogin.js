const bcrypt = require("bcrypt");
const connection = require("../config/dbConfig");

class EmploymentLogin {
  static async findByUsername(username, tableName = "Employment") {
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
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async findByID(id, tableName = "Employment") {
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
  }

  static async updatePassword(
    userId,
    hashedNewPassword,
    tableName = "Employment"
  ) {
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
  }
}

module.exports = EmploymentLogin;
