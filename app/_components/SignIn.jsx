import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";

let OTPlessSigninInstance = null;

export function initializeOTPless() {
  const script = document.createElement("script");
  script.src = "https://otpless.com/v2/headless.js";
  script.id = "otpless-sdk";
  script.setAttribute("data-appid", "P2E0047ZZJ3U12JSZ4TV");
  script.onload = () => {
    if (typeof window.OTPless !== "undefined") {
      const callback = (userinfo) => {
        console.log(userinfo);
      };

      OTPlessSigninInstance = new window.OTPless(callback);
    }
  };
  document.head.appendChild(script);
}

export async function sendOtp(contactNumber) {
  if (OTPlessSigninInstance) {
    try {
      await OTPlessSigninInstance.initiate({
        channel: "PHONE",
        phone: contactNumber,
        countryCode: "+91",
      });
      return true;
    } catch (error) {
      console.error("Error sending OTP:", error);
      return false;
    }
  }
  return false;
}

export async function verifyOtp(contactNumber, otp) {
  if (OTPlessSigninInstance) {
    try {
      const response = await OTPlessSigninInstance.verify({
        channel: "PHONE",
        phone: contactNumber,
        otp,
        countryCode: "+91",
      });
      if (response.success) {
        return true;
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  }
  return false;
}

export default function SignIn() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/artist"; // Get returnUrl from query params

  useEffect(() => {
    initializeOTPless();
  }, []);

  const handlePhoneAuth = async () => {
    const otpSent = await sendOtp(phone);
    if (otpSent) {
      setShowOtpSection(true);
    } else {
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    const verified = await verifyOtp(phone, otp);
    if (verified) {
      const user = { phone };
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("authToken", response.token);
      sessionStorage.setItem(
        "authExpiry",
        Date.now() + 7 * 24 * 60 * 60 * 1000
      );

      router.push(returnUrl);
    } else {
      setError("OTP is incorrect. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Sign In
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Sign in to access your artist dashboard
        </p>
        <div className="space-y-6">
          <div id="mobile-section">
            <label
              htmlFor="mobile-input"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile-input"
              placeholder="Enter mobile number"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              onClick={handlePhoneAuth}
              className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Request OTP
            </button>
          </div>

          {showOtpSection && (
            <div id="otp-section">
              <label
                htmlFor="otp-input"
                className="block text-sm font-medium text-gray-700"
              >
                OTP
              </label>
              <input
                type="text"
                id="otp-input"
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                onClick={handleVerifyOTP}
                className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
              >
                Verify OTP
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 text-red-500 text-center">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
