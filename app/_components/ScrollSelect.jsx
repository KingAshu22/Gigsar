import React, { useEffect, useRef } from "react";

const ScrollSelect = ({ options, selectedValue, setSelectedValue }) => {
  const scrollContainerRef = useRef(null);
  const itemHeight = 60; // Height of each item
  const visibleItems = 5; // Number of items to display (2 above, 2 below, and 1 selected)

  // Function to snap to the nearest item after scrolling
  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    const index = Math.round(scrollTop / itemHeight);
    const value = options[index] || options[0];
    setSelectedValue(value);
  };

  // Snapping behavior when scrolling stops
  const snapToNearest = () => {
    const container = scrollContainerRef.current;
    const { scrollTop } = container;
    const index = Math.round(scrollTop / itemHeight);
    container.scrollTo({
      top: index * itemHeight,
      behavior: "smooth",
    });
    setSelectedValue(options[index] || options[0]);
  };

  // Automatically scroll to the selected value when it changes
  useEffect(() => {
    const index = options.indexOf(selectedValue);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: index * itemHeight,
        behavior: "smooth",
      });
    }
  }, [selectedValue, options]);

  return (
    <div
      className="scroll-select-container overflow-y-auto"
      style={{
        height: `${itemHeight * visibleItems}px`, // Adjust the height to show 5 items
        paddingTop: `${itemHeight * 2}px`, // Add padding to top for 2 items
        paddingBottom: `${itemHeight * 2}px`, // Add padding to bottom for 2 items
      }}
      ref={scrollContainerRef}
      onScroll={handleScroll}
      onMouseUp={snapToNearest} // Snap after scroll ends on mouse up
      onTouchEnd={snapToNearest} // Snap after scroll ends on touch end (for mobile)
    >
      <div className="scroll-select-items text-center">
        {options.map((option, index) => (
          <div
            key={index}
            className={`py-2 text-lg ${
              selectedValue === option
                ? "text-primary font-bold"
                : "text-gray-600"
            }`}
            style={{ height: `${itemHeight}px` }}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollSelect;
