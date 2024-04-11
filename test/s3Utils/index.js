// testUpload.js
const fs = require("fs");
const { uploadImageToS3 } = require("../../src/utils/s3BucketUtils");

const imagePath = "./anis_bullied.jpg";
const imageBuffer = fs.readFileSync(imagePath);

const file = {
  buffer: imageBuffer,
  originalname: "anis_bullied.jpg",
};

uploadImageToS3(file, "anis-bullied-3.jpeg")
  .then((s3ObjectUrl) => {
    console.log("Image uploaded to S3:", s3ObjectUrl);
  })
  .catch((error) => {
    console.error("Error uploading image to S3:", error);
  });
