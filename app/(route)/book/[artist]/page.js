"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Script from "next/script";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { cn, formatToIndianNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import soundSystems from "./components/soundSystems";
import addOns from "./components/addOns";
import SingleSearch from "@/app/_components/SingleSearch";
import eventTypesOptions from "@/constants/eventTypes";
import withAuth from "@/lib/withAuth";

const eventTypeMapping = {
  Corporate: "corporateBudget",
  College: "collegeBudget",
  Wedding: "price",
  Reception: "price",
  Haldi: "price",
  Mehendi: "price",
  "Mayra/Bhaat": "price",
  "Musical/Vedic Pheras": "price",
  Sangeet: "price",
  "House Party": "singerCumGuitaristBudget",
  "Ticketing Concert": "ticketingConcertBudget",
  Virtual: "singerCumGuitaristBudget",
};

function BookArtistPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const inputRef = useRef(null);

  const artistName = params.artist.replace(/-/g, " ");
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState("");
  const [priceName, setPriceName] = useState("");
  const [date, setDate] = useState(null);
  const [location, setLocation] = useState(null);
  const [venue, setVenue] = useState(null);
  const [guestCount, setGuestCount] = useState("");
  const [selectedSoundSystem, setSelectedSoundSystem] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [artistPrice, setArtistPrice] = useState("");
  const [name, setName] = useState(null);
  const [showSpecs, setShowSpecs] = useState({}); // State to manage specs visibility
  const [currentStep, setCurrentStep] = useState(1); // State to manage current step

  useEffect(() => {
    getArtist();
  }, []);

  useEffect(() => {
    const eventParam = searchParams.get("event");
    const dateParam = searchParams.get("date");
    const nameParam = searchParams.get("name");
    if (eventParam) {
      setEvent(eventParam);
      setCurrentStep(2);
    }
    if (dateParam) {
      const parsedDate = new Date(dateParam);
      setDate(parsedDate);
      setCurrentStep(3);
    }
    if (nameParam) {
      setName(nameParam);
      setCurrentStep(4);
    }
  }, [searchParams]);

  useEffect(() => {
    if (artist && event) {
      const priceName = eventTypeMapping[event] || "";
      setPriceName(priceName);
      setArtistPrice(artist[priceName]);
    }
  }, [artist, event]);

  const getArtist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/artist/artistName/` + params.artist
      );
      setArtist(response.data);
    } catch (error) {
      console.error("Error fetching artist:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = () => {
    const { subtotal, gst, total } = calculatePrices(); // Ensure calculatePrices function is defined and returns correct values

    // Get the selected sound system name
    const selectedSoundSystemName = selectedSoundSystem
      ? soundSystems.find((system) => system.id === selectedSoundSystem)
          ?.name || "Not specified"
      : "Not specified";

    // Get the selected add-ons names
    const selectedAddOnNames = selectedAddOns.map(
      (id) => addOns.find((addOn) => addOn.id === id)?.name || "Unknown Add-On"
    );

    return `
      Enquiry Details:
      - Event: ${event}
      - Date: ${date ? date.toLocaleDateString() : "Not specified"}
      - Location: ${location}
      - Artist: ${artistName}
      - Guest Count: ${guestCount}
      - Selected Sound System: ${selectedSoundSystemName}
      - Selected Add-Ons: ${selectedAddOnNames.join(", ") || "None"}
      
      Pricing Details:
      - Artist Price: ${artistPrice || "Not specified"}
      - Sound System Price: ${
        selectedSoundSystem
          ? soundSystems.find((system) => system.id === selectedSoundSystem)
              ?.price || "0"
          : "0"
      }
      - Add-Ons Total: ${
        selectedAddOns.reduce(
          (total, id) =>
            total + (addOns.find((addOn) => addOn.id === id)?.price || 0),
          0
        ) || "0"
      }
      - Subtotal: ${subtotal || "0"}
      - GST: ${gst || "0"}
      - Total: ${total || "0"}
    `;
  };

  const sendEnquiry = async () => {
    setLoading(true);
    console.log("Inside send enquiry");

    try {
      const params = {
        name,
        email: "gigsar",
        contact: localStorage?.getItem("mobile"),
        location: `${venue} ${location}`,
        eventType: event,
        artistType: artist?.name,
        date: date.toLocaleString(),
        budget: total,
        message: formatMessage(),
      };
      console.log(params);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/gigsar-enquiry`,
        params
      );
      console.log("Enquiry sent successfully:", response.data);
    } catch (err) {
      console.error("Error sending enquiry:", err);
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

  const handleGuestsChange = (value) => {
    setGuestCount(value);
    const system = soundSystems.find((system) => system.guests === value);
    if (system) {
      setSelectedSoundSystem(system.id);
    } else {
      setSelectedSoundSystem(null);
    }
  };

  const handleAddOnsChange = (id) => {
    setSelectedAddOns((prev) =>
      prev.includes(id)
        ? prev.filter((addOnId) => addOnId !== id)
        : [...prev, id]
    );
  };

  const calculatePrices = () => {
    const soundSystem = soundSystems.find(
      (system) => system.id === selectedSoundSystem
    );
    const addOnPrices = selectedAddOns.map(
      (id) => parseFloat(addOns.find((addOn) => addOn.id === id)?.price) || 0
    );

    const soundSystemPrice = soundSystem ? parseFloat(soundSystem.price) : 0;
    const addOnsTotalPrice = addOnPrices.reduce(
      (total, price) => total + price,
      0
    );
    const subtotal =
      parseFloat(artistPrice) + soundSystemPrice + addOnsTotalPrice;

    const gst = Number.isFinite(subtotal) ? (subtotal * 18) / 100 : 0;
    const total = Number.isFinite(subtotal) ? subtotal + gst : 0;

    return { subtotal, gst, total };
  };

  const { subtotal, gst, total } = calculatePrices();

  const toggleSpecs = (id) => {
    setShowSpecs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
        Book <span className="capitalize">{artist?.name}</span> for {event}{" "}
        Event
      </h1>
      {currentStep === 1 && (
        <SingleSearch
          type="Event Type"
          list={eventTypesOptions}
          selectedItem={event}
          topList={eventTypesOptions}
          setSelectedItem={setEvent}
        />
      )}
      {currentStep === 2 && (
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
      {currentStep === 3 && (
        <div>
          <Label htmlFor="Name" className="text-lg">
            Enter Your Name
          </Label>
          <div className="relative">
            <Input
              id="name"
              type="text"
              value={name}
              autoComplete="off"
              className="w-full"
              placeholder="Enter Your Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      )}
      {currentStep === 4 && (
        <div>
          <Label htmlFor="location" className="text-lg">
            Event City
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
          <Label htmlFor="location" className="text-lg">
            {event === "House Party" ? <span>House</span> : <span>Venue</span>}{" "}
            Complete Address with Pin Code
          </Label>
          <div className="relative">
            <Input
              id="venue"
              type="text"
              value={venue}
              autoComplete="off"
              className="w-full"
              placeholder="Enter Venue Name"
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>
        </div>
      )}
      {currentStep === 5 && (
        <div>
          <Label htmlFor="guests" className="text-lg">
            Number of Guests
          </Label>
          <Select onValueChange={handleGuestsChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Number of Guests?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Up to 10">Up to 10</SelectItem>
              <SelectItem value="11 to 20">11 to 20</SelectItem>
              <SelectItem value="21 to 50">21 to 50</SelectItem>
              <SelectItem value="51 to 80">51 to 80</SelectItem>
              <SelectItem value="81 to 120">81 to 120</SelectItem>
              <SelectItem value="121 to 200">121 to 200</SelectItem>
              <SelectItem value="More than 200">More than 200</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {currentStep === 6 && (
        <div>
          <Label htmlFor="soundSystem" className="block mb-2 text-xl">
            Select Sound System
          </Label>
          <p className="p-2 text-lg">
            Based on your Guest Count ({guestCount}) we suggest you{" "}
            {soundSystems[selectedSoundSystem - 1].name} Sound System, If you
            still want to change the sound system then select an appropriate
            Sound System.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {soundSystems.map((system) => (
              <div
                key={system.id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedSoundSystem === system.id
                    ? "bg-primary text-white"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedSoundSystem(system.id)}
              >
                <h2 className="text-xl font-bold mb-2">{system.name}</h2>
                {showSpecs[system.id] && (
                  <p
                    className={`text-sm rounded p-1 mb-0 ${
                      selectedSoundSystem === system.id
                        ? "bg-red-600"
                        : "bg-gray-200"
                    }`}
                    dangerouslySetInnerHTML={{ __html: system.specs }}
                  ></p>
                )}
                <button
                  onClick={() => toggleSpecs(system.id)}
                  className={`flex items-center justify-between  p-2 rounded-lg w-full transition-colors duration-200 ${
                    selectedSoundSystem === system.id
                      ? "bg-red-600 hover:bg-red-900 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <span>
                    {showSpecs[system.id] ? "Hide Specs" : "Show Specs"}
                  </span>
                  {showSpecs[system.id] ? (
                    <ChevronUp className="ml-2" />
                  ) : (
                    <ChevronDown className="ml-2" />
                  )}
                </button>
                <p className="text-sm mb-1">
                  <span className="font-bold">Suitable Guest Count:</span>{" "}
                  {system.guests}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-bold">Suitable Event Type:</span>{" "}
                  {system.suitable}
                </p>
                <p
                  className={`text-lg font-semibold ${
                    selectedSoundSystem === system.id
                      ? "text-white"
                      : "text-primary"
                  }`}
                >
                  Price: ₹ {formatToIndianNumber(system.price)}/-
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {currentStep === 7 && (
        <div>
          <Label htmlFor="addOns" className="block mb-2 text-lg">
            Any Add On?
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOns.map((addOn) => (
              <div
                key={addOn.id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedAddOns.includes(addOn.id)
                    ? "bg-primary text-white"
                    : "border-gray-300"
                }`}
                onClick={() => handleAddOnsChange(addOn.id)}
              >
                <h2 className="text-xl font-bold mb-2">{addOn.name}</h2>
                <p
                  className="text-sm mb-4"
                  dangerouslySetInnerHTML={{ __html: addOn.specs }}
                ></p>
                <p
                  className={`text-lg font-semibold ${
                    selectedAddOns.includes(addOn.id)
                      ? "text-white"
                      : "text-primary"
                  }`}
                >
                  Price: ₹ {formatToIndianNumber(addOn.price)}/-
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {currentStep === 8 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Pricing Details</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="grid grid-cols-1 gap-4">
              {/* Artist Price */}
              <div className="flex justify-between">
                <p className="text-lg">
                  <span className="font-bold">Artist Price:</span>
                </p>
                <p className="text-lg">₹{formatToIndianNumber(artistPrice)}</p>
              </div>

              {/* Sound System Price */}
              {selectedSoundSystem && (
                <div className="flex justify-between">
                  <p className="text-lg">
                    <span className="font-bold">
                      Sound System Price (
                      {soundSystems[selectedSoundSystem - 1].name}):
                    </span>
                  </p>
                  <p className="text-lg">
                    ₹
                    {formatToIndianNumber(
                      soundSystems.find(
                        (system) => system.id === selectedSoundSystem
                      )?.price || 0
                    )}
                  </p>
                </div>
              )}

              {/* Add-Ons Price */}
              <div className="flex justify-between">
                <p className="text-lg">
                  <span className="font-bold">Add-Ons Price:</span>
                </p>
                <p className="text-lg">
                  ₹
                  {formatToIndianNumber(
                    selectedAddOns
                      .map(
                        (id) =>
                          addOns.find((addOn) => addOn.id === id)?.price || 0
                      )
                      .reduce((total, price) => total + price, 0)
                  )}
                </p>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between">
                <p className="text-lg">
                  <span className="font-bold">Subtotal:</span>
                </p>
                <p className="text-lg">₹{formatToIndianNumber(subtotal)}</p>
              </div>

              {/* GST */}
              <div className="flex justify-between">
                <p className="text-lg">
                  <span className="font-bold">GST (18%):</span>
                </p>
                <p className="text-lg">
                  ₹{formatToIndianNumber(Math.ceil(gst))}
                </p>
              </div>

              {/* Total */}
              <div className="flex justify-between">
                <p className="text-xl font-bold">
                  <span className="text-primary">Total:</span>
                </p>
                <p className="text-xl font-bold">
                  ₹{formatToIndianNumber(Math.ceil(total))}
                </p>
              </div>
            </div>
          </div>
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
        {currentStep < 8 && (
          <Button
            className="bg-primary text-white"
            variant="primary"
            onClick={nextStep}
            disabled={
              (currentStep === 1 && !event) ||
              (currentStep === 2 && !date) ||
              (currentStep === 3 && !name) ||
              (currentStep === 4 && !(location && venue)) ||
              (currentStep === 6 && !selectedSoundSystem)
            }
          >
            Next <ChevronRight />
          </Button>
        )}
        {currentStep === 8 && (
          <Button onClick={() => sendEnquiry()} disabled={loading}>
            {loading ? "Booking..." : "Book Now"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default withAuth(BookArtistPage);
