import React, { useEffect, useState } from "react";
import SingleSearch from "@/app/_components/SingleSearch";
import SearchList from "@/app/_components/SearchList";
import { Button } from "@/components/ui/button";
import Modal from "./Modal";
import {
  ArrowDown01,
  ArrowDown10,
  Copy,
  FilterIcon,
  SortAscIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ScrollSelect from "./ScrollSelect";
import { budgetOptions } from "@/constants/budget";
import { useRouter } from "next/navigation";
import MobileFilterPanel from "./MobileFilter";

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
  setApplyFilter,
}) => {
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);

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

  useEffect(() => {
    // Parse filters from the URL and apply them to state
    const queryFilters = router.query;

    if (queryFilters) {
      const newFilters = { ...selectedFilters };

      if (queryFilters.category) newFilters.category = queryFilters.category;
      if (queryFilters.genre) newFilters.genre = queryFilters.genre.split(",");
      if (queryFilters.eventType) newFilters.eventType = queryFilters.eventType;
      if (queryFilters.selectedDate)
        newFilters.selectedDate = new Date(queryFilters.selectedDate);
      if (queryFilters.location) newFilters.location = queryFilters.location;
      if (queryFilters.gender) newFilters.gender = queryFilters.gender;
      if (queryFilters.minBudget) newFilters.minBudget = queryFilters.minBudget;
      if (queryFilters.maxBudget) newFilters.maxBudget = queryFilters.maxBudget;
      if (queryFilters.sortOption)
        newFilters.sortOption = queryFilters.sortOption;

      handleFilterChange(newFilters); // Update the filter state
    }
  }, [router.query]);

  return (
    <>
      <div className="desktop w-full lg:w-2/5 lg:sticky lg:top-2 lg:h-full overflow-y-auto max-h-screen">
        <div className="bg-white mt-4 p-4 rounded shadow-md mb-4">
          <SingleSearch
            type="Artist Type"
            list={categories}
            topList={categories}
            selectedItem={selectedFilters.category}
            setSelectedItem={(category) => handleFilterChange({ category })}
            showSearch={false}
          />
          <hr />
          <SearchList
            type="Genre"
            list={genres}
            topList={topGenres}
            selectedItems={selectedFilters.genre}
            setSelectedItems={(genre) => handleFilterChange({ genre })}
          />
          <hr />
          <SingleSearch
            type="Event Type"
            list={eventsTypes}
            topList={topEventTypes}
            selectedItem={selectedFilters.eventType}
            setSelectedItem={(eventType) => handleFilterChange({ eventType })}
            showSearch={true}
          />
          <hr />
          {/* <Popover>
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
          </Popover> */}
          <SingleSearch
            type="Location"
            list={locations}
            topList={locations}
            selectedItem={selectedFilters.location}
            setSelectedItem={(location) => handleFilterChange({ location })}
            showSearch={true}
          />
          <hr />
          <SingleSearch
            type="Gender"
            list={genders}
            topList={genders}
            selectedItem={selectedFilters.gender}
            setSelectedItem={(gender) => handleFilterChange({ gender })}
            showSearch={false}
          />
          <hr />
          <SingleSearch
            type="Sort By Budget"
            list={["Low to High", "High to Low"]}
            topList={["Low to High", "High to Low"]}
            selectedItem={selectedFilters.sortOption}
            setSelectedItem={(sortOption) => handleFilterChange({ sortOption })}
            showSearch={false}
          />
          <hr />
          <div className="rounded-lg border-2 mb-4">
            <label className="block mb-2 ml-2 font-semibold">
              Minimum Budget
            </label>
            <div className="overflow-y-auto max-h-36">
              <SingleSearch
                list={minBudgetOptions}
                topList={minBudgetOptions}
                selectedItem={selectedFilters.minBudget}
                setSelectedItem={(minBudget) =>
                  handleFilterChange({ minBudget })
                }
                showSearch={false}
                isOneLine={true}
              />
            </div>
          </div>
          <div className="rounded-lg border-2">
            <label className="block mb-2 ml-2 font-semibold">
              Maximum Budget
            </label>
            <div className="overflow-y-auto max-h-36">
              <SingleSearch
                list={maxBudgetOptions}
                topList={maxBudgetOptions}
                selectedItem={selectedFilters.maxBudget}
                setSelectedItem={(maxBudget) =>
                  handleFilterChange({ maxBudget })
                }
                showSearch={false}
                isOneLine={true}
              />
            </div>
          </div>
          <div className="pt-4 bg-white border-t flex justify-between gap-2">
            <Button
              className="bg-primary text-white py-2 px-4 rounded w-full"
              onClick={handleCopyLink}
            >
              <Copy />
            </Button>
            <Button
              className="border-primary bg-white border-2 text-primary py-2 px-4 rounded mb-4 w-full"
              onClick={handleClearFilter}
            >
              Clear
            </Button>
            <Button
              className="border-primary border-2 py-2 px-4 rounded mb-4 w-full"
              onClick={() => {
                console.log("Applied Filter");

                setApplyFilter(true);
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
      {/* For mobile screen */}
      <div className="mobile">
        <div className="fixed bottom-0 w-full py-2 mb-[-5px] bg-primary flex justify-between left-0">
          <Button
            className="w-full flex justify-center items-center py-2 bg-primary text-white border-r-2 border-white rounded-r-none"
            onClick={() => {
              const newSortOption =
                selectedFilters.sortOption === "Low to High"
                  ? "High to Low"
                  : "Low to High";
              handleFilterChange({ sortOption: newSortOption });
              setApplyFilter(true);
            }}
          >
            {selectedFilters.sortOption === "Low to High" ? (
              <ArrowDown01 className="mr-2" />
            ) : (
              <ArrowDown10 className="mr-2" />
            )}
            Sort: {selectedFilters.sortOption}
          </Button>
          <Button
            className="w-full flex justify-center items-center py-2 bg-primary text-white rounded-l-none"
            onClick={() => setFilterOpen(true)}
          >
            <FilterIcon className="mr-2" />
            Filter
          </Button>
        </div>
        <MobileFilterPanel
          categories={categories}
          genres={genres}
          topGenres={topGenres}
          locations={locations}
          eventsTypes={eventsTypes}
          topEventTypes={topEventTypes}
          genders={genders}
          selectedFilters={selectedFilters}
          handleFilterChange={handleFilterChange}
          handleClearFilter={handleClearFilter}
          handleCopyLink={handleCopyLink}
          setApplyFilter={setApplyFilter}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
        />
      </div>
    </>
  );
};

export default FilterPanel;
