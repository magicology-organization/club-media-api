const connection = require("../config/dbConfig");

class Product {
  static createProduct(productData) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO Products (Name, Description, ImageLink, CreatedBy, CategoryID) VALUES (?, ?, ?, ?, ?)",
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
        "UPDATE Products SET Name = ?, Description = ?, ImageLink = ?, ModifiedBy = ?, CategoryID = ?, ModifiedAt = CURRENT_TIMESTAMP WHERE ProductID = ?",
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
        "DELETE FROM Products WHERE ProductID = ?",
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
        "SELECT * FROM Products WHERE ProductID = ?",
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
        "SELECT * FROM Products WHERE Name LIKE ? ORDER BY Name ASC",
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
      connection.query("SELECT * FROM Products", (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }
}

module.exports = Product;
