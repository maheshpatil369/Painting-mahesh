require('dotenv').config();
const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function checkConnection() {
  try {
    console.log("🔄 Testing AWS S3 connection...");
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log("✅ Success! Connection established.");
    console.log("📦 Your Buckets:", data.Buckets.map(b => b.Name));
    
    // Check if your specific bucket exists in the list
    const myBucket = process.env.AWS_S3_BUCKET_NAME;
    if (data.Buckets.some(b => b.Name === myBucket)) {
      console.log(`🎯 Target bucket "${myBucket}" is available.`);
    } else {
      console.log(`⚠️ Warning: Target bucket "${myBucket}" was not found in this account.`);
    }
  } catch (err) {
    console.error("❌ Connection failed!");
    console.error("Error Message:", err.message);
    console.log("\n💡 Check your .env file for correct keys, region, and bucket name.");
  }
}

checkConnection();