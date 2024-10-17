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

function BookArtistPage() {
  const router = useRouter(); // Initialize useRouter
  const params = useParams();
  const searchParams = useSearchParams();
  const inputRef = useRef(null);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(null);
  const [location, setLocation] = useState(null);
  const [name, setName] = useState(null);
  const [mobile, setMobile] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Load state from query parameters on mount
    const storedDate = searchParams.get("date");
    const storedLocation = searchParams.get("location");
    const storedName = searchParams.get("name");
    const storedMobile = searchParams.get("mobile");
    const storedStep = searchParams.get("step");

    if (storedDate) setDate(new Date(storedDate));
    if (storedLocation) setLocation(storedLocation);
    if (storedName) setName(storedName);
    if (storedMobile) setMobile(storedMobile);
    if (storedStep) setCurrentStep(Number(storedStep));
  }, []);

  useEffect(() => {
    // Update query parameters when any state changes
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (location) params.set("location", location.split(",")[0].trim());
    if (name) params.set("name", name);
    if (mobile) params.set("mobile", mobile);
    params.set("step", currentStep);

    router.push(`/singer-for-house-party?${params.toString()}`, undefined, {
      shallow: true,
    });
  }, [date, location, name, mobile, currentStep]);

  useEffect(() => {
    if (currentStep > 4) {
      getArtist(); // Fetch artist data the first time or on returning
    }
  }, [currentStep]);

  const getArtist = async () => {
    setLoading(true);
    setArtist(null); // Clear previous artists before making a new request
    try {
      const response = await axios.get("/api/featured-artists", {
        params: {
          date,
          location: location.split(",")[0].trim(),
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

  useEffect(() => {
    if (inputRef.current) {
      const initAutocomplete = () => {
        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["(cities)"],
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            setLocation(place.formatted_address);
          }
        });
      };

      if (typeof google !== "undefined" && google.maps) {
        initAutocomplete();
      }
    }
  }, [location]);

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="container mx-auto p-4">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={() => {
          if (inputRef.current) {
            const autocomplete = new google.maps.places.Autocomplete(
              inputRef.current,
              {
                types: ["(cities)"],
              }
            );

            autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();
              if (place.geometry) {
                setLocation(place.formatted_address);
              }
            });
          }
        }}
      />
      <h1 className="text-3xl font-bold mb-4 text-center">
        Book Singers for House Party
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
            <Input
              id="location"
              type="text"
              value={location}
              ref={inputRef}
              autoComplete="off"
              className="w-full"
              placeholder="Enter city name"
              onChange={(e) => setLocation(e.target.value)}
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
          <Label htmlFor="mobile" className="text-lg">
            Mobile Number:
          </Label>
          <div id="mobile-section">
            <label
              htmlFor="mobile-input"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-lg">+91</span>
              <input
                type="number"
                id="mobile"
                autoComplete="off"
                placeholder="Enter mobile number"
                className="flex-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      {currentStep === 5 && (
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
              selectedEventType="House Party"
              selectedDate={date}
              name={name}
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
        {currentStep < 5 && (
          <Button
            className="bg-primary text-white"
            variant="primary"
            onClick={nextStep}
            disabled={
              (currentStep === 1 && !date) ||
              (currentStep === 2 && !location) ||
              (currentStep === 3 && !name) ||
              (currentStep === 4 && (!mobile || mobile.length !== 10))
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
