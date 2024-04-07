import React from "react";

function layout({ children }) {
  return (
    <div className="grid grid-row-4">
      <div className="row-span-4 md:row-span-3">{children}</div>
    </div>
  );
}

export default layout;
