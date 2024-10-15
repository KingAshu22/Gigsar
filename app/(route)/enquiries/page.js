"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import withAuth from "@/lib/withAuth";
import ArtistList from "@/app/_components/ArtistList";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Enquiries() {
  const router = useRouter();

  const [contact, setContact] = useState("" || localStorage?.getItem("mobile"));
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableArtists, setAvailableArtists] = useState([]);
  const [pendingArtists, setPendingArtists] = useState([]);
  const [notAvailableArtists, setNotAvailableArtists] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [totalEnquiries, setTotalEnquiries] = useState(0);

  useEffect(() => {
    if (contact) {
      getClient();
    }
  }, [contact]);

  const getClient = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/client/contact/+${contact}`
      );

      if (response.data) {
        setClient(response.data);
        const uniqueDates = getUniqueDatesFromMessages(response.data);
        setAvailableDates(uniqueDates); // Set unique dates for dropdown
        setSelectedDate(uniqueDates[0]); // Set the latest date as default
      } else {
        router.push("/user-dashboard/registration");
      }
    } catch (error) {
      console.error("Error fetching Client:", error);
      router.push("/user-dashboard/registration");
    } finally {
      setLoading(false);
    }
  };

  // Function to extract unique event dates from the "Category" messages
  const getUniqueDatesFromMessages = (clientData) => {
    const uniqueDates = new Set();

    clientData.messages.forEach((messageGroup) => {
      messageGroup.message.forEach((msg) => {
        if (msg.content.includes("Category")) {
          const eventDateMatch = msg.content.match(/Date: ([^\n]*)/);
          if (eventDateMatch && eventDateMatch[1]) {
            uniqueDates.add(eventDateMatch[1]); // Add event date to the Set
          }
        }
      });
    });

    // Convert Set to Array and sort in descending order
    return Array.from(uniqueDates).sort((a, b) => new Date(b) - new Date(a));
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    filterArtistsByDate(newDate);
  };

  const filterArtistsByDate = async (date) => {
    const available = [];
    const pending = [];
    const notAvailable = [];
    let enquiriesCount = 0;

    const artistPromises = client.messages.map(async (messageGroup) => {
      let relevantCategoryMessage = null;

      // Find the "Category" message with the matching event date
      messageGroup.message.forEach((msg) => {
        if (msg.content.includes("Category")) {
          const eventDateMatch = msg.content.match(/Date: ([^\n]*)/);
          if (eventDateMatch && eventDateMatch[1] === date) {
            relevantCategoryMessage = msg;
          }
        }
      });

      if (!relevantCategoryMessage) return;

      enquiriesCount += 1; // Count enquiries for this date

      let categoryMessageIndex = -1;
      let nextCategoryMessageIndex = -1;

      // Find the index of the "Category" message and its range
      messageGroup.message.forEach((msg, index) => {
        if (msg.content.includes("Category")) {
          if (msg === relevantCategoryMessage) {
            categoryMessageIndex = index;
          } else if (
            categoryMessageIndex !== -1 &&
            nextCategoryMessageIndex === -1
          ) {
            nextCategoryMessageIndex = index;
          }
        }
      });

      // Check messages between the "Category" message and the next one (or end)
      let artistCategorized = false;
      for (
        let i = categoryMessageIndex + 1;
        i <
        (nextCategoryMessageIndex !== -1
          ? nextCategoryMessageIndex
          : messageGroup.message.length);
        i++
      ) {
        const msg = messageGroup.message[i];
        if (!msg.isSenderMe) {
          if (msg.content.includes("Yes")) {
            // Fetch the artist details by linkid
            const artistResponse = await axios.get(
              `/api/artists/${messageGroup.artistId}`
            );
            if (artistResponse.data) {
              available.push(artistResponse.data);
            }
            artistCategorized = true;
            break;
          } else if (msg.content.includes("No")) {
            // Fetch the artist details by linkid
            const artistResponse = await axios.get(
              `/api/artists/${messageGroup.artistId}`
            );
            if (artistResponse.data) {
              notAvailable.push(artistResponse.data);
            }
            artistCategorized = true;
            break;
          }
        }
      }

      if (!artistCategorized) {
        // Fetch the artist details by linkid
        const artistResponse = await axios.get(
          `/api/artists/${messageGroup.artistId}`
        );
        if (artistResponse.data) {
          pending.push(artistResponse.data);
        }
      }
    });

    // Await all artist data fetching
    await Promise.all(artistPromises);

    setAvailableArtists(available);
    setPendingArtists(pending);
    setNotAvailableArtists(notAvailable);
    setTotalEnquiries(enquiriesCount); // Set total enquiries
  };

  useEffect(() => {
    const fetchArtists = async () => {
      if (selectedDate) {
        await filterArtistsByDate(selectedDate);
      }
    };

    fetchArtists();
  }, [selectedDate, client]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader color="#dc2626" size={80} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 xl:p-10">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
        Your Enquiries
      </h1>
      <Separator className="bg-gray-400 my-4 md:my-5" />

      <div className="flex flex-col md:flex-row items-center mb-4 md:mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <label
          htmlFor="date-select"
          className="text-sm md:text-lg font-semibold w-full md:w-1/2 flex-shrink-0 max-w-[150px] text-left"
        >
          Enquiry Date:
        </label>
        <div className="w-full md:w-1/2 flex-shrink-0">
          <Select
            id="date-select"
            value={selectedDate}
            onValueChange={handleDateChange}
            className="w-full lg:max-w-[200px]"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent>
              {availableDates.map((date, index) => (
                <SelectItem key={index} value={date}>
                  {date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedDate && (
          <span className="text-lg font-semibold w-full md:w-1/2 flex-shrink-0 text-left">
            Total Enquiries: {totalEnquiries}
          </span>
        )}
      </div>

      <div className="space-y-6 md:space-y-8">
        <div className="bg-white p-4 md:p-5 lg:p-6 rounded-lg shadow-md">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3">
            Available Artists ({availableArtists.length})
          </h2>
          <ArtistList
            artists={availableArtists}
            showEnquiry={false}
            showBooking={true}
          />
        </div>
        <div className="bg-white p-4 md:p-5 lg:p-6 rounded-lg shadow-md">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3">
            Enquiry Pending ({pendingArtists.length})
          </h2>
          <ArtistList artists={pendingArtists} showEnquiry={false} />
        </div>
        <div className="bg-white p-4 md:p-5 lg:p-6 rounded-lg shadow-md">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3">
            Not Available Artists ({notAvailableArtists.length})
          </h2>
          <ArtistList artists={notAvailableArtists} showEnquiry={false} />
        </div>
      </div>
    </div>
  );
}

export default withAuth(Enquiries);
