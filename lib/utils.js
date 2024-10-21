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
