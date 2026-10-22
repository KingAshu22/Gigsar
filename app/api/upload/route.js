import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

const REGION = "ap-south-1"; // Region where the S3 bucket is located
const BUCKET = "gigsar";

// Configure AWS S3 with your access keys
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    // Retrieve data from request body
    const { artistName, cropData } = await req.json();

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

    // Check if folder exists
    const folderExists = await checkIfFolderExists(folderName);

    // Resize image to 350x350, compress, convert to webp
    const resizedImage = await resizeImage(cropData);

    // Generate unique filename
    const fileName = `${nanoid()}.webp`;
    const key = folderExists ? `${folderName}/${fileName}` : fileName;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: resizedImage,
        ACL: "public-read",
        ContentType: "image/webp",
      })
    );

    const location = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
    console.log("Image uploaded successfully at:", location);
    return NextResponse.json({ success: true, location });
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
    const data = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: folderName + "/",
        MaxKeys: 1,
      })
    );

    return (data.KeyCount ?? 0) > 0;
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
