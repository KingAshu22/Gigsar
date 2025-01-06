import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatToIndianNumber(num) {
  // Convert the string to a number
  const number = Number(num);

  // Check if the conversion is valid
  if (isNaN(number)) {
    return num;
  } else if (number >= 10000000) {
    // For Crore
    const croreValue = number / 10000000;
    return croreValue % 1 === 0
      ? croreValue.toFixed(0) + " Crore"
      : croreValue.toFixed(1) + " Crore";
  } else if (number >= 100000) {
    // For Lakh
    const lakhValue = number / 100000;
    return lakhValue % 1 === 0
      ? lakhValue.toFixed(0) + " Lakh"
      : lakhValue.toFixed(1) + " Lakh";
  } else {
    // Convert the number to Indian number format
    return number.toLocaleString("en-IN");
  }
}

export function getFormattedRange(
  price,
  corporateBudget,
  collegeBudget,
  singerCumGuitaristBudget,
  ticketingConcertBudget
) {
  // Convert all the budget values to an array of strings and filter out any empty strings
  const allValues = [
    price,
    corporateBudget,
    collegeBudget,
    singerCumGuitaristBudget,
    ticketingConcertBudget,
  ]
    .map((val) => Number(val)) // Convert strings to numbers
    .filter((val) => !isNaN(val)); // Remove NaN values (invalid entries)

  if (allValues.length === 0) {
    return "No valid data"; // If no valid data is provided
  }

  // Find the smallest and largest values
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // If the smallest and largest values are the same, return just one of them
  if (minValue === maxValue) {
    return formatToIndianNumber(minValue);
  }

  // Format the smallest and largest values using the formatToIndianNumber function
  const formattedMinValue = formatToIndianNumber(minValue);
  const formattedMaxValue = formatToIndianNumber(maxValue);

  // Return the formatted range in the required format
  return `${formattedMinValue} - ${formattedMaxValue}`;
}
