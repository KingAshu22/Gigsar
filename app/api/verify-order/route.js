import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";

const generatedSignature = (razorpayOrderId, razorpayPaymentId) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

export async function POST(NextRequest) {
  const { orderId, razorpayPaymentId, razorpaySignature } =
    await NextRequest.json();

  const signature = generatedSignature(orderId, razorpayPaymentId);
  if (signature !== razorpaySignature) {
    return NextResponse.json(
      { message: "payment verification failed", isOk: false },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "payment verified successfully", isOk: true },
    { status: 200 }
  );
}
