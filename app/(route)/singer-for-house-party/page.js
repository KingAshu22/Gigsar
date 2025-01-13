"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation"; // Import useRouter
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Script from "next/script";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ArtistList from "@/app/_components/ArtistList";
import SingleSearch from "@/app/_components/SingleSearch";

function BookArtistPage() {
  const router = useRouter(); // Initialize useRouter
  const params = useParams();
  const searchParams = useSearchParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(null);
  const [location, setLocation] = useState(null);
  const [name, setName] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Load state from query parameters on mount
    const storedDate = searchParams.get("date");
    const storedLocation = searchParams.get("location");
    const storedName = searchParams.get("name");
    const storedStep = searchParams.get("step");

    if (storedDate) setDate(new Date(storedDate));
    if (storedLocation) setLocation(storedLocation);
    if (storedName) setName(storedName);
    if (storedStep) setCurrentStep(Number(storedStep));
  }, []);

  useEffect(() => {
    // Update query parameters when any state changes
    const params = new URLSearchParams();
    if (date) {
      console.log(date.toLocaleDateString());

      params.set("date", date.toLocaleDateString());
    }
    if (location) params.set("location", location.split(",")[0].trim());
    if (name) params.set("name", name);
    params.set("step", currentStep);

    router.push(`/singer-for-house-party?${params.toString()}`, undefined, {
      shallow: true,
    });
  }, [date, location, name, currentStep]);

  useEffect(() => {
    if (currentStep > 3) {
      getArtist(); // Fetch artist data the first time or on returning
    }
  }, [currentStep]);

  const getArtist = async () => {
    setLoading(true);
    setArtist(null); // Clear previous artists before making a new request
    try {
      const response = await axios.get("/api/featured-artists", {
        params: {
          date: date.toLocaleDateString(),
          location: "Mumbai",
        },
      });

      if (response.data && response.data.length > 0) {
        setArtist(response.data); // Set artist data if found
      } else {
        setArtist([]); // Set empty array if no artists are found
      }
    } catch (error) {
      console.error("Error fetching artist:", error);
      setArtist([]); // Handle the case when there's an error or no artists
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Book Singer for House Party
      </h1>
      {currentStep === 1 && (
        <div>
          <Label htmlFor="date" className="text-lg">
            Event Date
          </Label>
          <br />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <Label htmlFor="location" className="text-lg">
            Event Location
          </Label>
          <div className="relative">
            <SingleSearch
              type={"Location"}
              list={["Mumbai", "Navi Mumbai", "Thane"]}
              topList={["Mumbai", "Navi Mumbai", "Thane"]}
              selectedItem={location}
              setSelectedItem={setLocation}
              showSearch={false}
            />
          </div>
        </div>
      )}
      {currentStep === 3 && (
        <div>
          <Label htmlFor="name" className="text-lg">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            autoComplete="off"
            className="w-full"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}
      {currentStep === 4 && (
        <div>
          <p>
            Following artists are available on your date:{" "}
            {date.toLocaleDateString()} and location: {location}
          </p>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ArtistList
              artists={artist}
              showBooking={true}
              showEnquiry={false}
              selectedEventType="House"
              selectedDate={date}
              name={name}
              bookLocation={location}
            />
          )}
        </div>
      )}
      <div className="flex justify-between mt-4">
        {currentStep > 1 && (
          <Button
            className="border-2 border-gray-300 text-gray-700"
            variant="secondary"
            onClick={prevStep}
          >
            <ChevronLeft /> Back
          </Button>
        )}
        <div className="flex-grow"></div> {/* Add this line */}
        {currentStep < 4 && (
          <Button
            className="bg-primary text-white"
            variant="primary"
            onClick={nextStep}
            disabled={
              (currentStep === 1 && !date) ||
              (currentStep === 2 && !location) ||
              (currentStep === 3 && !name)
            }
          >
            Next <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
}

export default BookArtistPage;
