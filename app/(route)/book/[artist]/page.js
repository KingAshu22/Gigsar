"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import cities from "@/lib/cities";
import soundSystems from "./components/soundSystems";
import addOns from "./components/addOns";

function BookArtistPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const artist = decodeURIComponent(params.artist); // Decode the URL-encoded artist name
  const [event, setEvent] = useState("");
  const [date, setDate] = useState(null);
  const [location, setLocation] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedSoundSystem, setSelectedSoundSystem] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState(null);

  useEffect(() => {
    const eventParam = searchParams.get("event");

    if (eventParam) {
      setEvent(eventParam);
    }
  }, [searchParams]);

  const handleLocationChange = (e) => {
    const query = e.target.value;
    setLocation(query);
    if (query.length > 0) {
      const filtered = cities.filter((city) =>
        city.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  };

  const handleGuestsChange = (value) => {
    const selectedGuests = value;
    console.log(selectedGuests);
    setGuestCount(selectedGuests);
    // Find the sound system that matches the selected guest count
    const system = soundSystems.find(
      (system) => system.guests === selectedGuests
    );
    if (system) {
      // Set the selected sound system based on the matched system's ID
      setSelectedSoundSystem(system.id);
    } else {
      // If no matching system is found, reset the selected sound system
      setSelectedSoundSystem(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Book {artist} for {event} Event
      </h1>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="mb-4 flex-1">
          <Label htmlFor="location">Event Location</Label>
          <div className="relative">
            <Input
              id="location"
              type="text"
              value={location}
              onChange={handleLocationChange}
              autoComplete="off"
              className="w-full"
              placeholder="Enter city name"
            />
            {filteredCities.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-200 w-full max-h-60 overflow-y-auto mt-1 rounded-md shadow-lg">
                {filteredCities.map((city, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setLocation(city);
                      setFilteredCities([]);
                    }}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mb-4 flex-1">
          <Label htmlFor="date">Event Date</Label>
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
        <div className="mb-4 flex-1">
          <Label htmlFor="guests">Number of Guests</Label>
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
      </div>
      <div className="mt-8">
        <Label htmlFor="soundSystem" className="block mb-2">
          Select Sound System
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {soundSystems.map((system) => (
            <div
              key={system.id}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedSoundSystem === system.id
                  ? "border-primary"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedSoundSystem(system.id)}
            >
              <h2 className="text-xl font-bold mb-2">{system.name}</h2>
              <p
                className="text-sm mb-4"
                dangerouslySetInnerHTML={{ __html: system.specs }}
              ></p>
              <p className="text-sm mb-1">
                <span className="font-bold">Suitable Guest Count:</span>{" "}
                {system.guests}
              </p>
              <p className="text-sm mb-1">
                <span className="font-bold">Suitable Event Type:</span>{" "}
                {system.suitable}
              </p>
              <p className="text-lg font-semibold text-primary">
                Price: {system.price}/-
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <Label htmlFor="soundSystem" className="block mb-2">
          Any Add On?
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {addOns.map((system) => (
            <div
              key={system.id}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedAddOns === system.id
                  ? "border-primary"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedAddOns(system.id)}
            >
              <h2 className="text-xl font-bold mb-2">{system.name}</h2>
              <p
                className="text-sm mb-4"
                dangerouslySetInnerHTML={{ __html: system.specs }}
              ></p>
              <p className="text-lg font-semibold text-primary">
                Price: {system.price}/-
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookArtistPage;
