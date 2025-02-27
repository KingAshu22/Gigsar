"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";

export default function PayButton({
  amount,
  name,
  email,
  contact,
  linkid,
  eventType,
  eventDate,
  location,
  address,
  zipCode,
  budget,
}) {
  const router = useRouter();
  const [order_Id, setOrder_Id] = useState("");
  const sendEnquiry = async () => {
    if (!linkid) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/client-message`,
        {
          linkid,
          contact,
          selectedLocation: location,
          selectedEventType: eventType,
          selectedDate: eventDate
            ? eventDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "", // Format date as "18 Aug 2024"
          budget,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const sendDataEnquiry = async () => {
    if (!linkid) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/data-entry`,
        {
          linkid,
          contact,
          selectedLocation: address + " " + location + " " + zipCode,
          selectedEventType: eventType,
          selectedDate: eventDate
            ? eventDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "", // Format date as "18 Aug 2024"
          budget,
          paymentDone: true,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const createOrder = async () => {
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount }), // passing the amount correctly
    });

    const data = await res.json();
    console.log("data:", data);

    setOrder_Id(data.id);
    if (!res.ok) {
      console.error("Error creating order:", data);
      return;
    }

    const paymentData = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "Gigsar",
      description: `Payment for Enquiring ${linkid.replace("-", " ")}`,
      order_id: data.id,
      prefill: {
        name: name,
        email: email,
        contact: contact,
      },
      send_sms_hash: true,
      handler: async function (response) {
        // verify payment

        // Send the order details to the server for verification and payment verification
        const res = await fetch("/api/verify-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        });

        const verifyData = await res.json();
        console.log(verifyData);
        if (verifyData.isOk) {
          // await sendEnquiry();
          await sendDataEnquiry();
          router.push(
            `/success?orderId=${order_Id}&name=${name}&email=${email}&contact=${contact}&linkid=${linkid}&eventType=${eventType}&eventDate=${eventDate}&location=${location}&budget=${budget}&amount=${amount}`
          );
        } else {
          alert("Payment failed");
        }
      },
    };

    const payment = new window.Razorpay(paymentData);
    payment.open();
  };

  return (
    <>
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Button className="bg-green-500 text-black" onClick={createOrder}>
        Pay ₹{amount} Now
      </Button>

      {localStorage.getItem("mobile") === "917021630747" && (
        <Button
          className="bg-green-500 text-black"
          onClick={async () => {
            await sendDataEnquiry();
            router.push(
              `/success?orderId=${order_Id}&name=${name}&email=${email}&contact=${contact}&linkid=${linkid}&eventType=${eventType}&eventDate=${eventDate}&location=${location}&budget=${budget}&amount=${amount}`
            );
          }}
        >
          Send Admin Enquiry
        </Button>
      )}
    </>
  );
}
