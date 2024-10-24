import Razorpay from "razorpay";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  const { amount } = await req.json();
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
  });

  return NextResponse.json(order);
}
