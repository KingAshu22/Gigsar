"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import * as animationData from "../../../../public/verified.json";
import LottieImg from "@/app/_components/Lottie";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SignIn({ isModal = false }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [returnUrl, setReturnUrl] = useState("");
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countryFlag, setCountryFlag] = useState("");
  const [timer, setTimer] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showVerifiedGif, setShowVerifiedGif] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const rawReturnUrl = searchParams.get("redirect_url");
    if (rawReturnUrl) {
      setReturnUrl(decodeURIComponent(rawReturnUrl));
    }
  }, [searchParams]);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        const countryCode = data.country_calling_code || "+91";
        const countryFlag = `https://flagicons.lipis.dev/flags/4x3/${data.country.toLowerCase()}.svg`;
        setCountryCode(countryCode);
        setCountryFlag(countryFlag);
      })
      .catch((error) => console.error("Error fetching IP data:", error));
  }, []);

  const startTimer = () => {
    setIsButtonDisabled(true);
    setTimer(120);
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(countdown);
          setIsButtonDisabled(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handlePhoneAuth = async () => {
    setError("");
    if (!phone || phone.length !== 10 || !/^[0-9]+$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const generatedOTP = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit OTP

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/gigsar-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactNumber: countryCode + phone,
          otp: generatedOTP,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("OTP sent successfully!");
        setShowOtpSection(true);
        startTimer();
      } else {
        toast.error("Failed to send OTP. Try again.");
        console.error(result);
      }
    } catch (err) {
      console.error("Send OTP Error:", err);
      toast.error("Something went wrong.");
    }
  };

  const handleVerifyOTP = () => {
    // For demo purposes, we just verify that otp is 6 digits
    if (!otp || otp.length !== 6 || !/^[0-9]+$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    // In a real app, you'd call a backend to validate this OTP
    // Here we simulate verification success
    localStorage.setItem("authExpiry", (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
    localStorage.setItem("mobile", `${countryCode.slice(1)}${phone}`);

    if (!isModal) setShowVerifiedGif(true);
    if (returnUrl) router.push(returnUrl);
  };

  return (
    <div className="flex justify-center p-4">
      {showVerifiedGif ? (
        <div className="flex items-center justify-center">
          <LottieImg animationData={animationData} loop="false" />
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          {!isModal && (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center text-primary">
                Sign In
              </h2>
              <p className="text-center text-gray-500 mb-8">
                Sign in to access your dashboard
              </p>
            </>
          )}
          <div className="space-y-6">
            <div id="mobile-section">
              <div className="flex items-center space-x-2">
                {!showOtpSection && (
                  <>
                    {countryFlag && (
                      <Image
                        src={countryFlag}
                        alt="Country Flag"
                        width={25}
                        height={25}
                      />
                    )}
                    <span className="text-lg">{countryCode}</span>
                    <input
                      type="number"
                      id="mobile-input"
                      placeholder="Enter mobile number"
                      maxLength={10}
                      className="flex-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={phone}
                      onChange={(e) => {
                        const input = e.target.value.replace(/[^0-9]/g, "");
                        if (input.length <= 10) {
                          setPhone(input);
                        }
                      }}
                    />
                  </>
                )}
              </div>
              <p className="text-sm mt-2">
                By Signing In, you agree to accept the{" "}
                <Link
                  href="/terms-and-conditions"
                  target="_blank"
                  className="text-primary"
                >
                  Terms & Conditions
                </Link>
              </p>
              {!showOtpSection && isModal && (
                <button
                  onClick={handlePhoneAuth}
                  className={`w-full mt-4 px-4 py-2 bg-primary ${
                    isButtonDisabled ? "opacity-75" : ""
                  } text-white rounded-lg hover:bg-red-800 transition duration-200`}
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled ? `Resend OTP in ${timer}s` : "Next"}
                </button>
              )}
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
                  maxLength={6}
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
      )}
    </div>
  );
}
