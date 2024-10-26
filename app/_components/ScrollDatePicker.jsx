import { useState, useEffect } from "react";
import Picker from "react-mobile-picker";

const generateDateOptions = () => {
  const today = new Date();
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => today.getFullYear() + i);

  return { dates, months, years };
};

export default function ScrollDatePicker() {
  const { dates, months, years } = generateDateOptions();
  const defaultPickerValue = {
    date: "Select Date",
    month: "Select Month",
    year: "Select Year",
  };

  const [pickerValue, setPickerValue] = useState(defaultPickerValue);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const isValidDate = (date, month, year) => {
      if (
        date === "Select Date" ||
        month === "Select Month" ||
        year === "Select Year"
      ) {
        return true; // Default values are not considered valid
      }
      const selectedDate = new Date(year, month - 1, date);
      return selectedDate >= Date.now();
    };

    if (!isValidDate(pickerValue.date, pickerValue.month, pickerValue.year)) {
      setErrorMessage("Please select future dates");
      setPickerValue(defaultPickerValue); // Reset to default if the date is invalid
    } else {
      setErrorMessage(""); // Clear error message if the date is valid
    }
  }, [pickerValue]);

  const handlePickerChange = (name, value) => {
    setPickerValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <Picker
        value={pickerValue}
        onChange={handlePickerChange}
        wheelMode="natural"
      >
        <Picker.Column name="date">
          <Picker.Item key="defaultDate" value="Select Date">
            Select Date
          </Picker.Item>
          {dates.map((date) => (
            <Picker.Item key={date} value={date}>
              {date}
            </Picker.Item>
          ))}
        </Picker.Column>
        <Picker.Column name="month">
          <Picker.Item key="defaultMonth" value="Select Month">
            Select Month
          </Picker.Item>
          {months.map((month) => (
            <Picker.Item key={month} value={month}>
              {month}
            </Picker.Item>
          ))}
        </Picker.Column>
        <Picker.Column name="year">
          <Picker.Item key="defaultYear" value="Select Year">
            Select Year
          </Picker.Item>
          {years.map((year) => (
            <Picker.Item key={year} value={year}>
              {year}
            </Picker.Item>
          ))}
        </Picker.Column>
      </Picker>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}
