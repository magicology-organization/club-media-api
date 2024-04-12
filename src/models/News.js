const connection = require("../config/dbConfig");

class News {
  static postNews(newsData) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO News (Title, Content, ShortDescription, ImageLink, CreatedBy, CategoryID) VALUES (?, ?, ?, ?, ?)",
        [
          newsData.title,
          newsData.content,
          newsdata.shortDescription,
          newsData.imageLink,
          newsData.userID,
          newsData.categoryID,
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

  static updateNews(newsID, newsData, modifiedBy) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE News SET Title = ?, Content = ?, ShortDescription = ?, ImageLink = ?, ModifiedBy = ?, CategoryID = ?, ModifiedAt = CURRENT_TIMESTAMP WHERE NewsID = ?",
        [
          newsData.title,
          newsData.content,
          newsData.shortDescription,
          newsData.imageLink,
          modifiedBy,
          newsData.categoryID,
          newsID,
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

  static deleteNews(newsID) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM News WHERE NewsID = ?",
        newsID,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results.affectedRows > 0);
        }
      );
    });
  }

  static findById(newsID) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM News WHERE NewsID = ?",
        newsID,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results[0]);
        }
      );
    });
  }

  static findByTitleStartingWith(letter) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM News WHERE Title LIKE ? ORDER BY Title ASC",
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

  static getAllNews() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM News", (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }

  static getRecentNews() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM News ORDER BY CreatedAt DESC LIMIT 6",
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  }

  static getNextSixNews(startIndex) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM News ORDER BY CreatedAt DESC LIMIT ?, 6",
        [startIndex],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  }
}

module.exports = News;
