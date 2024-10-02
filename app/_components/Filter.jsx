import React, { useState } from "react";
import SingleSearch from "@/app/_components/SingleSearch";
import SearchList from "@/app/_components/SearchList";
import { Button } from "@/components/ui/button";
import Modal from "./Modal";
import { Copy, Filter } from "lucide-react";
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
  locations,
  eventsTypes,
  topEventTypes,
  genders,
  selectedFilters,
  handleFilterChange,
  handleClearFilter,
  handleCopyLink,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);

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
              value={selectedFilters.searchQuery}
              onChange={(e) =>
                handleFilterChange({ searchQuery: e.target.value })
              }
              placeholder="Search by Artist Name..."
            />
          </div>
          <SingleSearch
            type="Artist Type"
            list={categories}
            topList={categories}
            selectedItem={selectedFilters.category}
            setSelectedItem={(category) => handleFilterChange({ category })}
            showSearch={false}
          />
          <SearchList
            type="Genre"
            list={genres}
            topList={topGenres}
            selectedItems={selectedFilters.genre}
            setSelectedItems={(genre) => handleFilterChange({ genre })}
          />
          <SingleSearch
            type="Event Type"
            list={eventsTypes}
            topList={topEventTypes}
            selectedItem={selectedFilters.eventType}
            setSelectedItem={(eventType) => handleFilterChange({ eventType })}
            showSearch={true}
          />
          <Popover>
            <label className="block mb-2 font-semibold">Event Date</label>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal
                  ${!selectedFilters.selectedDate && "text-muted-foreground"}
                `}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedFilters.selectedDate ? (
                  format(selectedFilters.selectedDate, "PPP")
                ) : (
                  <span>Event Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedFilters.selectedDate}
                onSelect={(date) => handleFilterChange({ selectedDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <SingleSearch
            type="Location"
            list={locations}
            topList={locations}
            selectedItem={selectedFilters.location}
            setSelectedItem={(location) => handleFilterChange({ location })}
            showSearch={true}
          />
          <SingleSearch
            type="Gender"
            list={genders}
            topList={genders}
            selectedItem={selectedFilters.gender}
            setSelectedItem={(gender) => handleFilterChange({ gender })}
            showSearch={false}
          />
          <SingleSearch
            type="Sort By Budget"
            list={["Low to High", "High to Low"]}
            topList={["Low to High", "High to Low"]}
            selectedItem={selectedFilters.sortOption}
            setSelectedItem={(sortOption) => handleFilterChange({ sortOption })}
            showSearch={false}
          />
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block mb-2 font-semibold">Min Budget</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={selectedFilters.minBudget}
                onChange={(e) =>
                  handleFilterChange({ minBudget: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-2 font-semibold">Max Budget</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={selectedFilters.maxBudget}
                onChange={(e) =>
                  handleFilterChange({ maxBudget: e.target.value })
                }
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
      <Button
        className="mobile fixed bottom-0 left-0 w-full bg-primary text-white py-2 px-4 pt-2 rounded-t shadow-lg flex items-center justify-center z-50"
        onClick={() => setFilterOpen(true)}
      >
        Filter
      </Button>
      {filterOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-xl font-bold mb-4">Filter</h2>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Search</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={selectedFilters.searchQuery}
                onChange={(e) =>
                  handleFilterChange({ searchQuery: e.target.value })
                }
                placeholder="Search by Artist Name..."
              />
            </div>
            <SingleSearch
              type="Artist Type"
              list={categories}
              topList={categories}
              selectedItem={selectedFilters.category}
              setSelectedItem={(category) => handleFilterChange({ category })}
              showSearch={false}
            />
            <SearchList
              type="Genre"
              list={genres}
              topList={topGenres}
              selectedItems={selectedFilters.genre}
              setSelectedItems={(genre) => handleFilterChange({ genre })}
            />
            <SingleSearch
              type="Event Type"
              list={eventsTypes}
              topList={topEventTypes}
              selectedItem={selectedFilters.eventType}
              setSelectedItem={(eventType) => handleFilterChange({ eventType })}
              showSearch={true}
            />
            <Popover>
              <label className="block mb-2 font-semibold">Event Date</label>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal
                  ${!selectedFilters.selectedDate && "text-muted-foreground"}
                `}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedFilters.selectedDate ? (
                    format(selectedFilters.selectedDate, "PPP")
                  ) : (
                    <span>Event Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedFilters.selectedDate}
                  onSelect={(date) =>
                    handleFilterChange({ selectedDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <SingleSearch
              type="Location"
              list={locations}
              topList={locations}
              selectedItem={selectedFilters.location}
              setSelectedItem={(location) => handleFilterChange({ location })}
              showSearch={true}
            />
            <SingleSearch
              type="Gender"
              list={genders}
              topList={genders}
              selectedItem={selectedFilters.gender}
              setSelectedItem={(gender) => handleFilterChange({ gender })}
              showSearch={false}
            />
            <SingleSearch
              type="Sort By Budget"
              list={["Low to High", "High to Low"]}
              topList={["Low to High", "High to Low"]}
              selectedItem={selectedFilters.sortOption}
              setSelectedItem={(sortOption) =>
                handleFilterChange({ sortOption })
              }
              showSearch={false}
            />
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label className="block mb-2 font-semibold">Min Budget</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={selectedFilters.minBudget}
                  onChange={(e) =>
                    handleFilterChange({ minBudget: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-2 font-semibold">Max Budget</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={selectedFilters.maxBudget}
                  onChange={(e) =>
                    handleFilterChange({ maxBudget: e.target.value })
                  }
                  placeholder="100000"
                />
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between gap-2">
            <Button
              variant="outline"
              className="w-1/3"
              onClick={handleClearFilter}
            >
              Clear Filters
            </Button>
            <Button
              className="w-1/3 bg-primary text-white"
              onClick={handleCopyLink}
            >
              <Copy size={16} className="mr-2" />
            </Button>
            <Button
              className="w-1/3 bg-primary text-white"
              onClick={() => setFilterOpen(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterPanel;
