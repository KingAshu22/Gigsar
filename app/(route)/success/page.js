"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import * as animationData from "../../../public/verified.json";
import LottieImg from "@/app/_components/Lottie";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // If you'd like to auto-redirect after a delay (optional)
    const timer = setTimeout(() => {
      router.push("/"); // Redirect to homepage or another page
    }, 10000); // Redirect after 10 seconds

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-500 mb-4">Thank you!</h1>
        <p className="text-lg text-gray-700 mb-4">
          Your enquiry has been sent successfully, and your booking has been
          confirmed!
        </p>
        <p className="text-lg text-gray-700 mb-4">
          We appreciate your trust in us, and we'll get back to you soon with
          more details.
        </p>
        <div className="my-6">
          <LottieImg animationData={animationData} loop={false} />
        </div>
        <Link
          href="/"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all"
        >
          Go Back to Homepage
        </Link>
      </div>
    </div>
  );
}
