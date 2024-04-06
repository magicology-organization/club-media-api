const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const {
  uploadImageToS3,
  deleteObjectFromS3,
} = require("../utils/s3BucketUtils");
const Product = require("../models/Products");
const EmploymentLogin = require("../models/EmploymentLogin");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to check user authorization
const checkAuthorization = async (req, res) => {
  try {
    const userID = req.userID.userId;
    if (!userID) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await EmploymentLogin.findByID(userID);
    if (!user) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return userID;
  } catch (error) {
    console.error("Error checking authorization:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to upload a product
exports.uploadProduct = [
  upload.single("image"),
  async (req, res) => {
    try {
      const userID = await checkAuthorization(req, res);
      if (!userID) return; // Return if authorization check fails

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
        createdBy: userID, // Using userID obtained from authorization check
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

// Middleware to update a product
exports.updateProduct = [
  async (req, res) => {
    try {
      const userID = await checkAuthorization(req, res);
      if (!userID) return; // Return if authorization check fails

      const productID = req.params.productId;
      if (!productID) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const existingProduct = await Product.findById(productID);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      const updatedProductData = {
        name: req.body.name || existingProduct.Name,
        description: req.body.description || existingProduct.Description,
        categoryID: req.body.categoryID || existingProduct.CategoryID,
        imageLink: existingProduct.ImageLink,
      };

      const success = await Product.updateProduct(
        productID,
        updatedProductData,
        userID
      );

      if (success) {
        res.status(200).json({ message: "Product updated successfully" });
      } else {
        res.status(500).json({ message: "Failed to update product" });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

exports.deleteProduct = [
  async (req, res) => {
    try {
      const userID = await checkAuthorization(req, res);
      if (!userID) return;

      const productID = req.params.productId;
      if (!productID) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const s3URL = (await Product.findById(productID)).ImageLink;
      const deletingProduct = await Product.deleteProduct(productID);
      if (!deletingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      const match = s3URL.match(/https:\/\/.*\.s3\.amazonaws\.com\/(.*)/);
      const keyToDelete = match[1];
      await deleteObjectFromS3(keyToDelete);

      if (deletingProduct) {
        res.status(200).json({ message: "Product deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete product" });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

exports.getProductByID = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.findProductsByNameStartingWith = async (req, res) => {
  try {
    const letter = req.params.letter;
    if (!letter) {
      return res.status(400).json({ message: "Letter is required" });
    }

    const products = await Product.findByNameStartingWith(letter);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error finding products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
