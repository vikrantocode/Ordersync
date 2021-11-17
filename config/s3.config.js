require("dotenv").config();
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  apiVersion: "2010-12-01",
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
  region: process.env.Region,
});
module.exports = s3;
