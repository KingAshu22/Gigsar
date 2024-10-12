import { useEffect, useRef, useState } from "react";

const ScrollSelect = ({ options, selectedValue, setSelectedValue }) => {
  const scrollContainerRef = useRef(null);
  const itemHeight = 60; // Height of each item
  const visibleItems = 3; // Show 3 items (1 above, 1 below, 1 selected)
  const [pickerValue, setPickerValue] = useState(selectedValue);

  // Function to handle scroll and set the value while scrolling
  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    const index = Math.round(scrollTop / itemHeight);
    const value = options[index] || options[0];

    // Update pickerValue and selectedValue while scrolling
    setPickerValue(value);
    setSelectedValue(value); // Automatically set the selected value as you scroll
  };

  const snapToNearest = () => {
    const container = scrollContainerRef.current;
    const { scrollTop } = container;
    const index = Math.round(scrollTop / itemHeight);

    // Smoothly scroll to the nearest item
    container.scrollTo({
      top: index * itemHeight,
      behavior: "smooth",
    });
  };

  // Effect to scroll to the correct position when selectedValue changes
  useEffect(() => {
    const index = options.indexOf(selectedValue);
    if (scrollContainerRef.current && index !== -1) {
      scrollContainerRef.current.scrollTo({
        top: index * itemHeight,
        behavior: "smooth",
      });
      setPickerValue(selectedValue);
    }
  }, [selectedValue, options]);

  return (
    <div
      className="scroll-select-container overflow-y-auto"
      style={{
        height: `${itemHeight * visibleItems}px`,
        paddingTop: `${itemHeight}px`, // 1 item height for padding on top
        paddingBottom: `${itemHeight}px`, // 1 item height for padding on bottom
      }}
      ref={scrollContainerRef}
      onScroll={handleScroll}
      onMouseUp={snapToNearest} // Snap after mouse drag
      onTouchEnd={snapToNearest} // Snap after touch drag
    >
      <div className="scroll-select-items text-center">
        {options.map((option, index) => (
          <div
            key={index}
            className={`py-2 text-lg ${
              pickerValue === option
                ? "text-primary font-bold border border-primary rounded" // Add a box around the selected item
                : "text-gray-600"
            }`}
            style={{
              height: `${itemHeight}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollSelect;
