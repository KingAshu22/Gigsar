"use client";

import { useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);

  const handleContinue = async () => {
    try {
      // Send OTP
      await axios.post("/api/send-otp", { mobile });
      setShowOtpDialog(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      // Verify OTP
      const response = await axios.post("/api/verify-otp", { mobile, otp });
      if (response.data.success) {
        // Handle successful verification
      } else {
        // Handle OTP verification failure
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mobile Number</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-lg"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="w-full bg-blue-500 text-white p-2 rounded-lg"
          >
            Continue
          </button>
        </form>
      </div>

      <Dialog
        open={showOtpDialog}
        onClose={() => setShowOtpDialog(false)}
        className="fixed inset-0 z-10 flex items-center justify-center"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Enter OTP</h3>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-lg mb-4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="button"
            onClick={handleVerifyOtp}
            className="w-full bg-green-500 text-white p-2 rounded-lg mb-4"
          >
            Verify OTP
          </button>
          <button
            type="button"
            onClick={() => setShowOtpDialog(false)}
            className="w-full bg-gray-500 text-white p-2 rounded-lg"
          >
            Change Mobile Number
          </button>
        </div>
      </Dialog>
    </div>
  );
}
