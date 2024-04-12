const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const {
  uploadImageToS3,
  deleteObjectFromS3,
} = require("../utils/s3BucketUtils");
const News = require("../models/News");
const AdminLogin = require("../models/AdminLogin");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class NewsHandler {
  static async checkAuthorization(req, res) {
    try {
      const userID = req.userID.userId;
      if (!userID) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await AdminLogin.findByID(userID);
      if (!user) {
        return res.status(403).json({ message: "Forbidden" });
      }
      return user.UserID;
    } catch (error) {
      console.error("Error checking authorization:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static postNews = [
    upload.single("image"),
    async (req, res) => {
      try {
        const userID = await NewsHandler.checkAuthorization(req, res);
        if (!userID) return; // Return if authorization check fails
        if (!req.file) {
          return res
            .status(400)
            .json({ message: "No illustration image uploaded" });
        }
        const requiredFields = [
          "title",
          "content",
          "description",
          "categoryID",
        ];
        const missingFields = requiredFields.filter(
          (field) => !req.body[field]
        );
        if (missingFields.length > 0) {
          return res.status(400).json({
            message: `Missing required fields: ${missingFields.join(", ")}`,
          });
        }
        const file = req.file;
        const imageKey = `${uuidv4()}-${file.originalname}`;
        const imageLink = await uploadImageToS3(file, imageKey);
        delete req.file;

        const newsData = {
          title: req.body.title,
          content: req.body.content,
          shortDescription: req.body.description,
          imageLink: imageLink,
          createdBy: userID, // Using userID obtained from authorization check
          categoryID: parseInt(req.body.categoryID),
        };

        const newsID = await News.postNews(newsData);
        res.status(201).json({ message: "News posted successfully", newsID });
      } catch (error) {
        console.error("Error posting news:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
  ];

  static updateNews = [
    async (req, res) => {
      try {
        const userID = await NewsHandler.checkAuthorization(req, res);
        if (!userID) return; // Return if authorization check fails

        const newsID = req.params.newsID;
        if (!newsID) {
          return res.status(400).json({ message: "News ID is required" });
        }

        const existingNews = await News.findById(newsID);
        if (!existingNews) {
          return res.status(404).json({ message: "News not found" });
        }

        const updatedNewsData = {
          title: req.body.title || existingNews.Title,
          content: req.body.content || existingNews.Content,
          shortDescription:
            req.body.shortDescription || existingNews.ShortDescription,
          imageLink: existingNews.ImageLink,
          categoryID: req.body.categoryID || existingNews.CategoryID,
        };

        const success = await News.updateNews(newsID, updatedNewsData, userID);

        if (success) {
          res.status(200).json({ message: "News updated successfully" });
        } else {
          res.status(500).json({ message: "Failed to update news" });
        }
      } catch (error) {
        console.error("Error updating news:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
  ];

  static deleteNews = [
    async (req, res) => {
      try {
        const userID = await NewsHandler.checkAuthorization(req, res);
        if (!userID) return;

        const newsID = req.params.newsID;
        if (!newsID) {
          return res.status(400).json({ message: "News ID is required" });
        }
        const s3ToDelete = await News.findById(newsID);
        if (!s3ToDelete) {
          return res.status(404).json({ message: "News not found" });
        }
        const s3URL = s3ToDelete.ImageLink;
        const deletingNews = await News.deleteNews(newsID);

        const match = s3URL.match(/https:\/\/.*\.s3\.amazonaws\.com\/(.*)/);
        const keyToDelete = match[1];
        await deleteObjectFromS3(keyToDelete);

        if (deletingNews) {
          res.status(200).json({ message: "News deleted successfully" });
        } else {
          res.status(500).json({ message: "Failed to delete news" });
        }
      } catch (error) {
        console.error("Error updating news:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
  ];

  static async getNewsByID(req, res) {
    try {
      const newsID = req.params.newsID;
      if (!newsID) {
        return res.status(400).json({ message: "News ID is required" });
      }

      const news = await News.findById(newsID);
      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }

      res.status(200).json({ news });
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getAllNews(req, res) {
    try {
      const news = await News.getAllNews();
      res.status(200).json({ news });
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async findNewsByTitleStartingWith(req, res) {
    try {
      const letter = req.params.letter;
      if (!letter) {
        return res.status(400).json({ message: "Letter is required" });
      }

      const news = await News.findByTitleStartingWith(news);
      res.status(200).json({ news });
    } catch (error) {
      console.error("Error finding news:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getRecentNews(req, res) {
    try {
      const recentNews = await News.getRecentNews();
      res.status(200).json({ recentNews });
    } catch (error) {
      console.error("Error fetching recent news:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getSixNews(req, res) {
    try {
      const { startIndex } = req.params.index;
      if (!startIndex) {
        return res.status(400).json({ message: "Start index is required" });
      }

      const nextSixNews = await News.getNextSixNews(parseInt(startIndex));
      res.status(200).json({ nextSixNews });
    } catch (error) {
      console.error("Error fetching next six news:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = NewsHandler;
