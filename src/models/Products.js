const connection = require("../config/dbConfig");

class Product {
  static createProduct(productData) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO News (Name, Description, ImageLink, CreatedBy, CategoryID) VALUES (?, ?, ?, ?, ?)",
        [
          productData.name,
          productData.description,
          productData.imageLink,
          productData.createdBy,
          productData.categoryID,
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results.insertId);
        }
      );
    });
  }

  static updateProduct(productID, productData, modifiedBy) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE News SET Name = ?, Description = ?, ImageLink = ?, ModifiedBy = ?, CategoryID = ?, ModifiedAt = CURRENT_TIMESTAMP WHERE NewsID = ?",
        [
          productData.name,
          productData.description,
          productData.imageLink,
          modifiedBy,
          productData.categoryID,
          productID,
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results.affectedRows > 0);
        }
      );
    });
  }

  static deleteProduct(productID) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM News WHERE NewsID = ?",
        productID,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results.affectedRows > 0);
        }
      );
    });
  }

  static findById(productID) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM News WHERE NewID = ?",
        productID,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results[0]);
        }
      );
    });
  }

  static findByNameStartingWith(letter) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM News WHERE Name LIKE ? ORDER BY Name ASC",
        [`${letter}%`],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  }

  static getAllProducts() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM News", (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }
}

module.exports = Product;
