import React from "react";

export const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-500"></div>
    </div>
  );
};
