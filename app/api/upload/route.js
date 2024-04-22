import AWS from "aws-sdk";
import sharp from "sharp";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

// Configure AWS S3 with your access keys
AWS.config.setPromisesDependency(require("bluebird"));
AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: "ap-south-1", // Specify the region where your S3 bucket is located
});

const s3 = new AWS.S3();

export async function POST(req) {
  try {
    // Retrieve data from request body
    const { artistName, cropData } = req.body;

    console.log(req.body);

    // Check if artistName or cropData is missing
    if (!artistName || !cropData) {
      return NextResponse.json(
        {
          error: "Artist name or cropped image data is missing.",
        },
        { status: 400 }
      );
    }

    // Replace spaces in artistName with "-"
    const folderName = artistName.replace(/\s+/g, "-");

    // Check if folder exists, if not create it
    const folderExists = await checkIfFolderExists(folderName);

    // Resize image to 350x350, compress, convert to webp
    const resizedImage = await resizeImage(cropData);

    // Generate unique filename
    const fileName = `${nanoid()}.webp`;

    const s3Params = {
      Bucket: "gigsar",
      Key: folderExists ? `${folderName}/${fileName}` : fileName,
      Body: resizedImage,
      ACL: "public-read",
      ContentEncoding: "base64", // required
      ContentType: `image/webp`, // required. Notice the back ticks
    };
    const { Location } = await s3.upload(s3Params).promise();
    console.log("Image uploaded successfully at:", Location);
    return NextResponse.json({ success: true, location: Location });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

async function checkIfFolderExists(folderName) {
  try {
    const params = {
      Bucket: "gigsar",
      Prefix: folderName + "/",
    };

    const data = await s3.listObjectsV2(params).promise();

    return data.Contents.length > 0;
  } catch (error) {
    console.error("Error checking if folder exists:", error);
    return false;
  }
}

async function resizeImage(base64Data) {
  try {
    // Decode base64 data
    const buffer = Buffer.from(
      base64Data.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    // Resize image to 350x350, auto-compress, convert to webp
    const resizedImageBuffer = await sharp(buffer)
      .resize({ width: 350, height: 350, fit: "cover" })
      .toFormat("webp")
      .toBuffer();

    return resizedImageBuffer;
  } catch (error) {
    console.error("Error resizing image:", error);
    throw error;
  }
}
