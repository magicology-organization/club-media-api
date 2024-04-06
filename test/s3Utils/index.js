// testUpload.js
const fs = require("fs");
const { uploadImageToS3 } = require("../../src/utils/s3UploadUtils");

const imagePath = "./test_image.webp";
const imageBuffer = fs.readFileSync(imagePath);

const file = {
  buffer: imageBuffer,
  originalname: "test_image.webp",
};

uploadImageToS3(file)
  .then((s3ObjectUrl) => {
    console.log("Image uploaded to S3:", s3ObjectUrl);
  })
  .catch((error) => {
    console.error("Error uploading image to S3:", error);
  });
