const connection = require("../config/dbConfig");

class NewsCategory {
  static createCategory(categoryName) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO NewsCategories (Name) VALUES (?)",
        [categoryName],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results.insertId);
        }
      );
    });
  }

  static updateCategory(categoryID, newName) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE NewsCategories SET Name = ? WHERE CategoryID = ?",
        [newName, categoryID],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results.affectedRows > 0);
        }
      );
    });
  }

  static deleteCategory(categoryID) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM NewsCategories WHERE CategoryID = ?",
        categoryID,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results.affectedRows > 0);
        }
      );
    });
  }

  static getCategoryByID(categoryID) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM NewsCategories WHERE CategoryID = ?",
        categoryID,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results[0]);
        }
      );
    });
  }

  static getAllCategories() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM NewsCategories", (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }
}
