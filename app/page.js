"use client";
import { useState, useEffect } from "react";
import ArtistFilter from "./(route)/artist/page";
import clsx from "clsx"; // For conditional classnames

export default function Home() {
  const [enteredPin, setEnteredPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isError, setIsError] = useState(false); // To trigger error state
  const [errorMsg, setErrorMsg] = useState(""); // For error message

  // On mount, check if PIN is already saved in localStorage
  useEffect(() => {
    const savedPin = localStorage.getItem("userPin");
    if (savedPin === "8888") {
      setIsUnlocked(true); // Unlock if correct PIN is saved
    }
  }, []);

  const handleKeyPress = (value) => {
    if (enteredPin.length < 4) {
      setEnteredPin((prev) => prev + value);
    }
  };

  const handleBackspace = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    if (enteredPin.length === 4) {
      if (enteredPin === "8888") {
        localStorage.setItem("userPin", "8888");
        setIsUnlocked(true); // Unlock if PIN is correct
      } else {
        setErrorMsg("Incorrect PIN, try again");
        setIsError(true);

        setTimeout(() => {
          setIsError(false);
          setEnteredPin("");
          setErrorMsg(""); // Clear the error message
        }, 2000);
      }
    }
  }, [enteredPin]);

  useEffect(() => {
    const handleKeyboardInput = (e) => {
      if (e.key >= "0" && e.key <= "9" && enteredPin.length < 4) {
        handleKeyPress(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      }
    };

    window.addEventListener("keydown", handleKeyboardInput);
    return () => {
      window.removeEventListener("keydown", handleKeyboardInput);
    };
  }, [enteredPin]);

  if (isUnlocked) {
    return <ArtistFilter />;
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white md:bg-gray-100">
      <div className="w-full max-w-xs p-8 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-6">Enter Your PIN</h2>
        <div className="mb-6">
          {/* Display entered pin */}
          <div
            className={clsx("flex justify-center mb-4", {
              "animate-shake": isError, // Add shake animation on error
            })}
          >
            {Array(4)
              .fill("")
              .map((_, i) => (
                <span
                  key={i}
                  className={clsx(
                    "h-4 w-4 mx-1 rounded-full transition-colors duration-300",
                    {
                      "bg-red-500": isError, // Red when there is an error
                      "bg-black": i < enteredPin.length && !isError,
                      "bg-gray-300": i >= enteredPin.length && !isError,
                    }
                  )}
                ></span>
              ))}
          </div>
          {isError && (
            <p className="text-red-500 text-sm font-semibold">{errorMsg}</p>
          )}
        </div>
        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((key) => (
            <button
              key={key}
              className="p-4 bg-gray-200 hover:bg-primary rounded-full text-lg font-bold focus:outline-none"
              onClick={() => handleKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            className="p-4 px-8 bg-gray-200 hover:bg-primary rounded-full text-lg font-bold focus:outline-none"
            onClick={() => handleKeyPress("0")}
          >
            0
          </button>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            className="p-4 bg-gray-200 rounded-full text-lg font-bold focus:outline-none"
            onClick={handleBackspace}
          >
            ←
          </button>
        </div>
      </div>
    </div>
  );
}
