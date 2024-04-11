const bcrypt = require("bcrypt");
const connection = require("../config/dbConfig");

class AdminLogin {
  static async findByUsername(username, tableName = "Admin") {
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

  static async findByID(id, tableName = "Admin") {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM ${tableName} WHERE AdminID = ?`,
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

  static async updatePassword(userId, hashedNewPassword, tableName = "Admin") {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE ${tableName} SET LoginPassword = ? WHERE AdminID = ?`,
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

module.exports = AdminLogin;
