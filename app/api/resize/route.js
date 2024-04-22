import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  try {
    const { cropData } = NextRequest.body;

    // Decode base64 data
    const buffer = Buffer.from(
      cropData.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    // Resize image to 350x350, auto-compress, convert to webp
    const resizedImageBuffer = await sharp(buffer)
      .resize({ width: 350, height: 350, fit: "cover" })
      .toFormat("webp")
      .toBuffer();

    // Send the resized image buffer as the response
    return NextResponse.json({
      success: true,
      resizedImageBuffer: resizedImageBuffer,
    });
  } catch (error) {
    console.error("Error resizing image:", error);
    return NextResponse.json(
      { error: "Error Resizing Image" },
      { status: 500 }
    );
  }
}
