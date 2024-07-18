import { options } from "@/constants/chatBotOptions";
import { lazy, Suspense, useEffect, useState } from "react";
import { sendOtp, verifyOtp, initializeOTPless } from "./SignIn";
const ChatBot = lazy(() => import("react-chatbotify"));

const MyBot = () => {
  const [form, setForm] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [contactNumber, setContactNumber] = useState("");

  useEffect(() => {
    setIsLoaded(true);
    initializeOTPless();
  }, []);

  const formStyle = {
    marginTop: 10,
    marginLeft: 20,
    border: "1px solid #491d8d",
    padding: 10,
    borderRadius: 5,
    maxWidth: 300,
  };

  const flow = {
    start: {
      message:
        "Hello, I am Gigsar Chat Bot 👋! Welcome to Gigsar Website, I'm excited to help you today 😊!",
      transition: { duration: 1000 },
      path: "showOptions",
    },
    showOptions: {
      message: "Here are few helpful things you can check out to get started:",
      options: ["Enquiry Form", "About Gigsar"],
      path: (params) => {
        if (params.userInput === "Enquiry Form") {
          return "askName";
        } else if (params.userInput === "About Gigsar") {
          return "aboutGigsar";
        }
      },
    },
    askName: {
      message: "Please enter your name:",
      function: (params) =>
        setForm((prevForm) => ({ ...prevForm, name: params.userInput })),
      path: "askNumber",
    },
    askNumber: {
      message: (params) => `${params.userInput}, Send me your Mobile Number`,
      function: async (params) => {
        setContactNumber(params.userInput);
        await sendOtp(params.userInput);
      },
      path: "verifyOTP",
    },
    verifyOTP: {
      message: "Share your OTP sent to your Mobile Number",
      path: async (params) => {
        const status = await verifyOtp(contactNumber, params.userInput);
        if (status) {
          await params.injectMessage("OTP verified successfully!");
          return "askEmail";
        } else {
          await params.injectMessage("OTP is incorrect. Please try again.");
          return "verifyOTP";
        }
      },
    },
    askEmail: {
      message: "OTP verified! Please enter your email:",
      function: (params) =>
        setForm((prevForm) => ({ ...prevForm, email: params.userInput })),
      path: "selectArtistType",
    },
    selectArtistType: {
      message: "Select Artist Type:",
      options: ["Singer/Band", "Musician", "DJ"],
      function: (params) =>
        setForm((prevForm) => ({ ...prevForm, artistType: params.userInput })),
      path: "selectEventType",
    },
    selectEventType: {
      message: "Select Event Type:",
      options: ["Wedding", "Corporate", "College", "House Party", "Private"],
      function: (params) =>
        setForm((prevForm) => ({ ...prevForm, eventType: params.userInput })),
      path: "enterEventCity",
    },
    enterEventCity: {
      message: "Enter Event City:",
      function: (params) =>
        setForm((prevForm) => ({ ...prevForm, eventCity: params.userInput })),
      path: "selectBudget",
    },
    selectBudget: {
      message: "Select Budget:",
      options: [
        "0-20,000",
        "20,000-50,000",
        "50,000-1,00,000",
        "1,00,000-5,00,000",
        "5,00,000-10,00,000",
      ],
      function: (params) =>
        setForm((prevForm) => ({ ...prevForm, budget: params.userInput })),
      path: "end",
    },
    aboutGigsar: {
      message: "Gigsar is an Artist Search Engine and Booking Platform.",
      chatDisabled: true,
    },
    end: {
      message: "Thank you for providing your details!",
      render: (
        <div style={formStyle}>
          <p>Name: {form.name}</p>
          <p>Email: {form.email}</p>
          <p>Artist Type: {form.artistType}</p>
          <p>Event Type: {form.eventType}</p>
          <p>Event City: {form.eventCity}</p>
          <p>Budget: {form.budget}</p>
        </div>
      ),
      options: ["Start Over"],
      chatDisabled: true,
      path: "start",
    },
  };

  return (
    <>
      {isLoaded && (
        <Suspense fallback={<div>Loading...</div>}>
          <ChatBot options={options} flow={flow} />
        </Suspense>
      )}
    </>
  );
};

export default MyBot;
