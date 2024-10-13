import React, { useState } from "react";
import SingleSearch from "@/app/_components/SingleSearch";
import SearchList from "@/app/_components/SearchList";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Copy } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { budgetOptions } from "@/constants/budget";

const MobileFilterPanel = ({
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
  setApplyFilter,
  filterOpen,
  setFilterOpen,
}) => {
  const [activeNav, setActiveNav] = useState("Artist Type");

  const minBudgetOptions = budgetOptions.filter(
    (option) =>
      !selectedFilters.maxBudget ||
      parseInt(option.replace(/,/g, "")) <=
        parseInt(selectedFilters.maxBudget.replace(/,/g, ""))
  );

  const maxBudgetOptions = budgetOptions.filter(
    (option) =>
      !selectedFilters.minBudget ||
      parseInt(option.replace(/,/g, "")) >=
        parseInt(selectedFilters.minBudget.replace(/,/g, ""))
  );

  const renderActiveContent = () => {
    switch (activeNav) {
      case "Artist Type":
        return (
          <SingleSearch
            type="Artist Type"
            list={categories}
            topList={categories}
            selectedItem={selectedFilters.category}
            setSelectedItem={(category) => handleFilterChange({ category })}
            showSearch={false}
          />
        );
      case "Genre":
        return (
          <SearchList
            type="Genre"
            list={genres}
            topList={topGenres}
            selectedItems={selectedFilters.genre}
            setSelectedItems={(genre) => handleFilterChange({ genre })}
          />
        );
      case "Event Type":
        return (
          <SingleSearch
            type="Event Type"
            list={eventsTypes}
            topList={topEventTypes}
            selectedItem={selectedFilters.eventType}
            setSelectedItem={(eventType) => handleFilterChange({ eventType })}
            showSearch={true}
          />
        );
      case "Event Date":
        return (
          <Popover>
            <label className="block mb-2 font-semibold">Event Date</label>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal
                  ${!selectedFilters.selectedDate && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedFilters.selectedDate
                  ? format(selectedFilters.selectedDate, "PPP")
                  : "Event Date"}
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
        );
      case "Location":
        return (
          <SingleSearch
            type="Location"
            list={locations}
            topList={locations}
            selectedItem={selectedFilters.location}
            setSelectedItem={(location) => handleFilterChange({ location })}
            showSearch={true}
          />
        );
      case "Gender":
        return (
          <SingleSearch
            type="Gender"
            list={genders}
            topList={genders}
            selectedItem={selectedFilters.gender}
            setSelectedItem={(gender) => handleFilterChange({ gender })}
            showSearch={false}
          />
        );
      case "Sort By Budget":
        return (
          <SingleSearch
            type="Sort By Budget"
            list={["Low to High", "High to Low"]}
            topList={["Low to High", "High to Low"]}
            selectedItem={selectedFilters.sortOption}
            setSelectedItem={(sortOption) => handleFilterChange({ sortOption })}
            showSearch={false}
          />
        );
      case "Min Budget":
        return (
          <SingleSearch
            type="Minimum Budget"
            list={minBudgetOptions}
            topList={minBudgetOptions}
            selectedItem={selectedFilters.minBudget}
            setSelectedItem={(minBudget) => handleFilterChange({ minBudget })}
            showSearch={false}
          />
        );
      case "Max Budget":
        return (
          <SingleSearch
            type="Maximum Budget"
            list={maxBudgetOptions}
            topList={maxBudgetOptions}
            selectedItem={selectedFilters.maxBudget}
            setSelectedItem={(maxBudget) => handleFilterChange({ maxBudget })}
            showSearch={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {filterOpen && (
        <div className="fixed inset-0 bg-white z-50 flex">
          <div className="w-2/5 bg-gray-200 py-4 pl-2">
            <h1 className="pl-2 font-bold text-lg text-primary">
              Gigsar Filters
            </h1>
            <hr className="bg-black pt-[1px] ml-[-5px]" />
            <nav className="flex flex-col space-y-8 pt-8">
              {[
                "Artist Type",
                "Genre",
                "Event Type",
                "Event Date",
                "Location",
                "Gender",
                "Sort By Budget",
                "Min Budget",
                "Max Budget",
              ].map((navItem) => (
                <button
                  key={navItem}
                  className={`text-left px-2 py-1 
                    ${
                      activeNav === navItem
                        ? "text-primary font-semibold bg-white pt-2 pb-2 rounded-l-lg ml-3"
                        : ""
                    }
                  `}
                  onClick={() => setActiveNav(navItem)}
                >
                  {navItem}
                </button>
              ))}
            </nav>
          </div>
          <div className="w-3/5 p-4 overflow-y-auto">
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="text-primary"
                onClick={handleClearFilter}
              >
                Clear All
              </Button>
            </div>
            {renderActiveContent()}
          </div>
          <div className="fixed bottom-0 w-full p-4 bg-white border-t flex justify-between">
            <Button
              className="bg-primary text-white"
              onClick={() => {
                setFilterOpen(false);
              }}
            >
              Close
            </Button>
            <Button
              variant="outline"
              className="text-black"
              onClick={handleCopyLink}
            >
              <Copy />
            </Button>
            <Button
              className="bg-primary text-white"
              onClick={() => {
                setFilterOpen(false);
                setApplyFilter(true);
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFilterPanel;
