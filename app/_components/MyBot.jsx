import { options } from "@/constants/chatBotOptions";
import { lazy, Suspense, useEffect, useState } from "react";
import { sendOtp, verifyOtp, initializeOTPless } from "./SignIn";
import axios from "axios";
import ArtistFilter from "../(route)/artist/page";
const ChatBot = lazy(() => import("react-chatbotify"));

const MyBot = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [artistType, setArtistType] = useState("");
  const [artistOptions, setArtistOptions] = useState([]);
  const [eventsType, setEventsType] = useState("");
  const [eventsOptions, setEventsOptions] = useState([]);
  const [gender, setGender] = useState("");
  const [genderOptions, setGenderOptions] = useState([]);
  const [eventDate, setEventDate] = useState("");
  const [eventCity, setEventCity] = useState("");
  const [budget, setBudget] = useState("");
  const [isSend, setIsSend] = useState(false);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    setIsLoaded(true);
    initializeOTPless();
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/artist`);
      const filteredArtists = response.data.filter(
        (artist) => artist.showGigsar
      );
      setArtists(filteredArtists);
      extractFilters(filteredArtists);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  const extractFilters = (artists) => {
    const uniqueCategories = [
      "All Artist Types",
      ...new Set(artists.map((artist) => artist.artistType)),
    ];
    setArtistOptions(uniqueCategories);

    const allEventTypes = artists.flatMap((artist) =>
      artist.eventsType.split(", ")
    );

    // Calculate top 10 genres based on frequency
    const eventsFrequency = allEventTypes.reduce((acc, eventsType) => {
      acc[eventsType] = (acc[eventsType] || 0) + 1;
      return acc;
    }, {});
    const sortedEventTypes = Object.entries(eventsFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([eventsType]) => eventsType);
    const uniqueSortedEventTypes = [
      "All Event Types",
      ...new Set(sortedEventTypes),
    ];
    setEventsOptions(uniqueSortedEventTypes);

    const uniqueGenders = [
      "All",
      ...new Set(artists.map((artist) => artist.gender)),
    ];
    setGenderOptions(uniqueGenders);
  };

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
      message:
        "Share your OTP sent to your Mobile Number, if your mobile number is incorrect please select Change Number option.",
      options: ["Change Mobile Number"],
      path: async (params) => {
        if (params.userInput === "Change Mobile Number") {
          return "askNumber";
        } else {
          const status = await verifyOtp(contactNumber, params.userInput);
          if (status) {
            return "askEmail";
          } else {
            await params.injectMessage("OTP is incorrect. Please try again.");
            return "verifyOTP";
          }
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
      options: artistOptions,
      function: (params) => setArtistType(params.userInput),
      path: "artistGender",
    },
    artistGender: {
      message: "Select Artist Gender",
      options: genderOptions,
      function: (params) => setGender(params.userInput),
      path: "selectEventType",
    },
    selectEventType: {
      message: "Select Event Type",
      options: eventsOptions,
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
            placeholder="Select Event Date"
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
        "20,000-1,00,000",
        "1,00,000-10,00,000",
        "10,00,000-20,00,000",
        "20,00,000-50,00,000",
        "50,00,000 +",
      ],
      function: (params) => setBudget(params.userInput),
      path: "end",
    },
    end: {
      message: "Thanks for sharing the details, We will contact you soon.",
      function: () => sendData(),
      render: (
        <div style={formStyle}>
          <h2>Collected Data</h2>
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Contact Number:</strong> {contactNumber}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Artist Type:</strong> {artistType}
          </p>
          <p>
            <strong>Gender:</strong> {gender}
          </p>
          <p>
            <strong>Event Type:</strong> {eventsType}
          </p>
          <p>
            <strong>Event Date:</strong> {eventDate}
          </p>
          <p>
            <strong>Event City:</strong> {eventCity}
          </p>
          <p>
            <strong>Budget:</strong> {budget}
          </p>
        </div>
      ),
      end: true,
    },
    aboutGigsar: {
      message:
        "Gigsar is an Artist booking platform, where you can book artists and find artist details based on your requirements.",
      path: "showOptions",
    },
  };

  return (
    <div>
      {isLoaded && (
        <Suspense fallback={<div>Loading...</div>}>
          <ChatBot options={options} flow={flow} />
        </Suspense>
      )}
    </div>
  );
};

export default MyBot;
