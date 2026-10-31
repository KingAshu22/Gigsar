import axios from "axios";

function formatEventDate(eventDate) {
  if (eventDate instanceof Date && !isNaN(eventDate)) {
    return eventDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  if (typeof eventDate === "string" && eventDate !== "Not selected") {
    return eventDate;
  }
  return "";
}

// Asks the server to email the enquiry to the artist from support@gigsar.com.
// Pass `payment` (the Razorpay response) for paid enquiries; leave it out for free ones.
// Never throws: a failed email should not block the enquiry itself.
export async function emailArtistEnquiry({ payment, eventDate, ...details }) {
  try {
    const { data } = await axios.post("/api/artist-enquiry", {
      ...details,
      eventDate: formatEventDate(eventDate),
      orderId: payment?.razorpay_order_id,
      razorpayPaymentId: payment?.razorpay_payment_id,
      razorpaySignature: payment?.razorpay_signature,
    });
    return data;
  } catch (error) {
    console.error("Error emailing artist:", error);
    return { sent: false };
  }
}
