const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { uploadImageToS3 } = require("../utils/s3UploadUtils");
const Product = require("../models/Products");
const EmploymentLogin = require("../models/EmploymentLogin");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadProduct = [
  upload.single("image"),
  async (req, res) => {
    try {
      const userID = req.userID.userId;
      if (!userID) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await EmploymentLogin.findByID(userID);

      // check for active employee / files uploaded
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const file = req.file;
      const imageKey = `${uuidv4()}-${file.originalname}`;
      const imageLink = await uploadImageToS3(file, imageKey);
      delete req.file;

      const productData = {
        name: req.body.name,
        description: req.body.description,
        imageLink: imageLink,
        createdBy: user.EmployeeID,
        categoryID: req.body.categoryID,
      };

      const productId = await Product.createProduct(productData);
      res
        .status(201)
        .json({ message: "Product uploaded successfully", productId });
    } catch (error) {
      console.error("Error uploading product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
