// import axios from "axios";

// let artistType = [];
// let eventTypes = [];

// export const initializeData = async () => {
//   try {
//     const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/artist`);
//     const artists = response.data.filter((artist) => artist.showGigsar);

//     artistType = [...new Set(artists.map((artist) => artist.artistType))];

//     console.log(artistType);

//     const allEventTypes = artists.flatMap((artist) =>
//       artist.eventsType.split(", ")
//     );
//     eventTypes = ["All Event Types", ...new Set(allEventTypes)];
//   } catch (error) {
//     console.error("Error initializing data:", error);
//   }
// };

// export { artistType, eventTypes };
