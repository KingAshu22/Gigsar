import React, { useState } from "react";
import SingleSearch from "@/app/_components/SingleSearch";
import SearchList from "@/app/_components/SearchList";
import { Button } from "@/components/ui/button";
import Modal from "./Modal";
import { Filter } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const FilterPanel = ({
  categories,
  genres,
  topGenres,
  location,
  eventsTypes,
  topEventTypes,
  languages,
  topLanguages,
  instruments,
  topInstruments,
  genders,
  budgetOptions,
  selectedCategory,
  setSelectedCategory,
  selectedGenre,
  setSelectedGenre,
  selectedLocation,
  setSelectedLocation,
  selectedEventType,
  setSelectedEventType,
  selectedDate,
  setSelectedDate,
  selectedLanguage,
  setSelectedLanguage,
  selectedInstrument,
  setSelectedInstrument,
  selectedGender,
  setSelectedGender,
  selectedSortOption,
  setSelectedSortOption,
  selectedMinBudget,
  setSelectedMinBudget,
  selectedMaxBudget,
  setSelectedMaxBudget,
  handleClearFilter,
  handleCopyLink,
  searchQuery,
  setSearchQuery,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);

  console.log(location);

  return (
    <>
      <div className="desktop w-full lg:w-1/4 lg:sticky lg:top-4 lg:h-full overflow-y-auto max-h-screen">
        <div className="bg-white p-4 rounded shadow-md mb-4">
          <h2 className="text-xl font-bold mb-2">Filter</h2>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Search</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Artist Name..."
            />
          </div>
          <SingleSearch
            type="Artist Type"
            list={categories}
            topList={categories}
            selectedItem={selectedCategory}
            setSelectedItem={setSelectedCategory}
            showSearch={false}
          />
          <SearchList
            type="Genre"
            list={genres}
            topList={topGenres}
            selectedItems={selectedGenre}
            setSelectedItems={setSelectedGenre}
          />
          <SingleSearch
            type="Event Type"
            list={eventsTypes}
            topList={topEventTypes}
            selectedItem={selectedEventType}
            setSelectedItem={setSelectedEventType}
            showSearch={true}
          />
          <Popover>
            <label className="block mb-2 font-semibold">Event Date</label>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal
                  ${!selectedDate && "text-muted-foreground"}
                `}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Event Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {/* <SearchList
            type="Language"
            list={languages}
            topList={topLanguages}
            selectedItems={selectedLanguage}
            setSelectedItems={setSelectedLanguage}
          /> */}
          {/* <SearchList
            type="Instruments"
            list={instruments}
            topList={topInstruments}
            selectedItems={selectedInstrument}
            setSelectedItems={setSelectedInstrument}
          /> */}
          <SingleSearch
            type="Location"
            list={location}
            topList={location}
            selectedItem={selectedLocation}
            setSelectedItem={setSelectedLocation}
            showSearch={true}
          />
          <SingleSearch
            type="Gender"
            list={genders}
            topList={genders}
            selectedItem={selectedGender}
            setSelectedItem={setSelectedGender}
            showSearch={false}
          />
          <SingleSearch
            type="Sort By Budget"
            list={["Low to High", "High to Low"]}
            topList={["Low to High", "High to Low"]}
            selectedItem={selectedSortOption}
            setSelectedItem={setSelectedSortOption}
            showSearch={false}
          />
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block mb-2 font-semibold">Min Budget</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={selectedMinBudget}
                onChange={(e) => setSelectedMinBudget(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-2 font-semibold">Max Budget</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={selectedMaxBudget}
                onChange={(e) => setSelectedMaxBudget(e.target.value)}
                placeholder="100000"
              />
            </div>
          </div>
          <button
            className="border-primary border-2 text-primary py-2 px-4 rounded mb-4 w-full"
            onClick={handleClearFilter}
          >
            Clear Filters
          </button>
          <button
            className="bg-primary text-white py-2 px-4 rounded w-full"
            onClick={handleCopyLink}
          >
            Copy Filters Link
          </button>
        </div>
      </div>
      {/* For mobile screen */}
      <button
        className="fixed left-0 ml-0 bg-primary text-white py-2 px-4 rounded shadow-lg flex items-center z-50"
        onClick={() => {
          setFilterOpen(true);
        }}
      >
        <Filter className="mr-2" /> Filter
      </button>
      <Modal
        isOpen={filterOpen}
        onClose={() => {
          setFilterOpen(false);
        }}
        title="Filter"
      >
        <div className="space-y-4">
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Search</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Artist Name..."
            />
          </div>
          <SingleSearch
            type="Artist Type"
            list={categories}
            topList={categories}
            selectedItem={selectedCategory}
            setSelectedItem={setSelectedCategory}
            showSearch={false}
          />
          <SearchList
            type="Genre"
            list={genres}
            topList={topGenres}
            selectedItems={selectedGenre}
            setSelectedItems={setSelectedGenre}
          />
          <SingleSearch
            type="Event Type"
            list={eventsTypes}
            topList={topEventTypes}
            selectedItem={selectedEventType}
            setSelectedItem={setSelectedEventType}
            showSearch={true}
          />
          <Popover>
            <label className="block mb-2 font-semibold">Event Date</label>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal
                  ${!selectedDate && "text-muted-foreground"}
                `}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Event Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {/* <SearchList
            type="Language"
            list={languages}
            topList={topLanguages}
            selectedItems={selectedLanguage}
            setSelectedItems={setSelectedLanguage}
          /> */}
          {/* <SearchList
            type="Instruments"
            list={instruments}
            topList={topInstruments}
            selectedItems={selectedInstrument}
            setSelectedItems={setSelectedInstrument}
          /> */}
          <SingleSearch
            type="Location"
            list={location}
            topList={location}
            selectedItem={selectedLocation}
            setSelectedItem={setSelectedLocation}
            showSearch={true}
          />
          <SingleSearch
            type="Gender"
            list={genders}
            topList={genders}
            selectedItem={selectedGender}
            setSelectedItem={setSelectedGender}
            showSearch={false}
          />
          <SingleSearch
            type="Sort By Budget"
            list={["Low to High", "High to Low"]}
            topList={["Low to High", "High to Low"]}
            selectedItem={selectedSortOption}
            setSelectedItem={setSelectedSortOption}
            showSearch={false}
          />
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block mb-2 font-semibold">Min Budget</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={selectedMinBudget}
                onChange={(e) => setSelectedMinBudget(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-2 font-semibold">Max Budget</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={selectedMaxBudget}
                onChange={(e) => setSelectedMaxBudget(e.target.value)}
                placeholder="100000"
              />
            </div>
          </div>
          <div className="flex justify-center mt-4 gap-4">
            <Button
              className="border-primary border-2 rounded"
              onClick={() => {
                handleClearFilter();
                setFilterOpen(false);
              }}
            >
              Clear Filters
            </Button>
            <Button
              className="bg-primary text-white rounded"
              onClick={handleCopyLink}
            >
              Copy Filters Link
            </Button>
            <Button
              className="bg-primary"
              onClick={() => {
                setFilterOpen(false);
              }}
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FilterPanel;
