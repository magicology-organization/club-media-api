const connection = require("../config/dbConfig");

const Product = {};

Product.createProduct = (productData) => {
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
};

Product.updateProduct = (productID, productData, modifiedBy) => {
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
};

Product.deleteProduct = (productID) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM products WHERE ProductID = ?",
      productID,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.affectedRows > 0);
      }
    );
  });
};

Product.findById = (productID) => {
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
};

Product.findByNameStartingWith = (letter) => {
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
};

module.exports = Product;
