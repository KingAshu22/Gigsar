import { options } from "@/constants/chatBotOptions";
import { lazy, Suspense, useEffect, useState } from "react";
import { sendOtp, verifyOtp, initializeOTPless } from "./SignIn";
import axios from "axios";
const ChatBot = lazy(() => import("react-chatbotify"));

const MyBot = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [artistType, setArtistType] = useState("");
  const [eventsType, setEventsType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventCity, setEventCity] = useState("");
  const [budget, setBudget] = useState("");
  const [isSend, setIsSend] = useState(false);

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

  async function sendData() {
    try {
      if (
        !isSend &&
        name &&
        contactNumber &&
        email &&
        artistType &&
        eventsType &&
        eventDate &&
        eventCity &&
        budget
      ) {
        const formData = {
          name,
          email,
          contact: contactNumber,
          location: eventCity,
          eventType: eventsType,
          artistType,
          date: eventDate,
          budget,
        };
        setIsSend(true);
        await axios.post(
          `${process.env.NEXT_PUBLIC_API}/enquiry-form`,
          formData,
          {
            withCredentials: true,
          }
        );
        console.log("Data sent successfully");
      }
    } catch (error) {
      console.log("Error sending data:", error);
    }
  }

  const flow = {
    start: {
      message:
        "Hello, I am Gigsar Chat Bot, Welcome to Gigsar Website, I'm excited to help you today.",
      transition: { duration: 2000 },
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
      function: (params) => setName(params.userInput),
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
          return "askEmail";
        } else {
          await params.injectMessage("OTP is incorrect. Please try again.");
          return "verifyOTP";
        }
      },
    },
    askEmail: {
      message: "OTP verified successfully! Please enter your email:",
      function: (params) => setEmail(params.userInput),
      path: "selectArtistType",
    },
    selectArtistType: {
      message: "Select Artist Type",
      options: ["Singer-Band", "Musician", "DJ"],
      function: (params) => setArtistType(params.userInput),
      path: "selectEventType",
    },
    selectEventType: {
      message: "Select Event Type",
      options: ["Wedding", "Corporate", "College", "Private", "House Party"],
      function: (params) => setEventsType(params.userInput),
      path: "enterEventCity",
    },
    enterEventCity: {
      message: "Enter Event City:",
      function: (params) => setEventCity(params.userInput),
      path: "selectEventDate",
    },
    selectEventDate: {
      message: "Select Event Date & Select Yes when done",
      render: (
        <div>
          <input
            type="date"
            onChange={(e) => setEventDate(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              marginTop: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              marginBottom: "10px",
              fontSize: "16px",
            }}
          />
        </div>
      ),
      options: ["Yes", "No"],
      path: (params) => {
        if (params.userInput === "Yes") {
          return "selectBudget";
        } else if (params.userInput === "No") {
          return "selectEventDate";
        }
      },
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
      function: (params) => setBudget(params.userInput),
      path: "end",
    },
    aboutGigsar: {
      message: "Gigsar is an Artist Search Engine and Booking Platform.",
      chatDisabled: true,
      path: "showOptions",
    },
    end: {
      message: "Thank you for providing your details!",
      render: (
        <div style={formStyle}>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <p>Contact: {contactNumber}</p>
          <p>Event City: {eventCity}</p>
          <p>Artist Type: {artistType}</p>
          <p>Event Type: {eventsType}</p>
          <p>Event Date: {eventDate}</p>
          <p>Budget: {budget}</p>
        </div>
      ),
      function: sendData(),
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
