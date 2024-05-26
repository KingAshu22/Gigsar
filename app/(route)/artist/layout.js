import React from "react";

function layout({ children }) {
  return (
    <div className="grid grid-row-4">
      <div className="row-span-4 md:row-span-3">{children}</div>
    </div>
  );
}

export const metadata = {
  title: "Artist | Gigsar",
  description:
    "Gigsar provides singers, live bands, musicians, instrumentalists, dj for events such as corporate events, college events, wedding events, house parties, private parties, virtual events. We offer a variety of singers, including playback singers, sufi singers, and live ghazal singers",
};

export default layout;
