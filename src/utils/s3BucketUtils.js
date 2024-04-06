// s3UploadUtils.js
const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_KEY_AWS,
  region: process.env.DEFAULT_REGION_AWS,
});

// Modified to ensure unique keys across the bucket
// Images will be stored within tmp folder, uploads will stay there and be deleted after execution
const uploadImageToS3 = (file, imageKey) => {
  // Determine the content type of the image based on its file extension
  const contentType = file.mimetype;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: imageKey,
    Body: file.buffer,
    ContentType: contentType, // Set the content type dynamically
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data.Location);
      }
    });
  });
};

const deleteObjectFromS3 = (objectKey) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: objectKey,
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  uploadImageToS3,
  deleteObjectFromS3,
};
