"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Bill = () => {
  const searchParams = useSearchParams();
  const filterParams = new URLSearchParams(searchParams.toString());
  const params = Object.fromEntries(filterParams.entries());
  const {
    orderId,
    name,
    email,
    contact,
    linkid,
    eventType,
    eventDate,
    location,
    budget,
    amount,
  } = params;

  const [formattedEventDate, setFormattedEventDate] = useState("");

  useEffect(() => {
    // Format date client-side
    const date = new Date(eventDate);
    setFormattedEventDate(date.toLocaleDateString());
  }, [eventDate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center mb-4">
            Event Enquiry Bill
          </h1>

          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-left">
                  Description
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  Client Name
                </td>
                <td className="border border-gray-300 p-2">{name}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  Email
                </td>
                <td className="border border-gray-300 p-2">{email}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  Contact
                </td>
                <td className="border border-gray-300 p-2">{contact}</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border border-gray-300 p-2 font-semibold">
                  Artist Name
                </td>
                <td className="border border-gray-300 p-2">
                  {linkid.replace("-", " ")}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  Event Type
                </td>
                <td className="border border-gray-300 p-2">{eventType}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  Event Date
                </td>
                <td className="border border-gray-300 p-2">
                  {formattedEventDate}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  Location
                </td>
                <td className="border border-gray-300 p-2">{location}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  Budget
                </td>
                <td className="border border-gray-300 p-2">₹{budget}</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border border-gray-300 p-2 font-semibold">
                  Enquiry Charges
                </td>
                <td className="border border-gray-300 p-2">₹{amount}</td>
              </tr>
              <tr>
                <td
                  className="border border-gray-300 p-2 font-semibold text-red-600"
                  colSpan={2}
                >
                  Note: This is a non-refundable amount.
                </td>
              </tr>
              {/* <tr>
                <td className="border border-gray-300 p-2 font-semibold">
                  Order ID
                </td>
                <td className="border border-gray-300 p-2">{orderId}</td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bill;
