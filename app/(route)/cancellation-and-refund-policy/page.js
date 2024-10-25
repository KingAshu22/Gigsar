// pages/cancellation-refund.js
import Head from "next/head";

const CancellationRefundPolicy = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <Head>
        <title>Cancellation and Refund Policy - Gigsar</title>
        <meta
          name="description"
          content="Read Gigsar's cancellation and refund policy regarding booking and artist charges."
        />
      </Head>

      <h1 className="text-4xl font-bold my-6">
        Cancellation and Refund Policy
      </h1>

      <section className="max-w-2xl text-lg text-gray-800">
        <p className="mb-4">
          At Gigsar, we strive to provide the best experience for our users when
          booking artists for various events. This Cancellation and Refund
          Policy outlines our procedures and guidelines regarding cancellations,
          refunds, and the applicable charges. By using our services, you agree
          to comply with this policy.
        </p>

        <h2 className="text-2xl font-semibold my-4">1. Booking Charges</h2>
        <p className="mb-4">
          When you book an artist through Gigsar, you will incur a{" "}
          <strong>Booking Charge</strong> which is a non-refundable fee for
          securing the artist's services for your event. This charge helps us
          manage your bookings and provide you with the best possible service.
        </p>

        <h2 className="text-2xl font-semibold my-4">2. Enquiry Charges</h2>
        <p className="mb-4">
          In addition to booking charges, if you choose to inquire about an
          artist's availability or services, an <strong>Enquiry Charge</strong>{" "}
          may be applied. This fee is also non-refundable, as it covers the
          administrative costs of processing your inquiry.
        </p>

        <h2 className="text-2xl font-semibold my-4">
          3. Artist Charges and Refund Policy
        </h2>
        <p className="mb-4">
          The charges associated with the artist's services for the event are
          subject to the artist’s individual refund policy. We encourage you to
          directly communicate with the artist regarding their refund policies
          before finalizing your booking. Each artist may have different terms
          concerning cancellations, rescheduling, and refunds.
        </p>

        <h2 className="text-2xl font-semibold my-4">4. Cancellation Process</h2>
        <p className="mb-4">
          If you need to cancel your booking, please notify us as soon as
          possible. You can do this by contacting our customer support team at{" "}
          <strong>support@gigsar.com</strong> or by using the contact
          information provided in your booking confirmation email.
        </p>
        <p className="mb-4">Upon cancellation, the following will apply:</p>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Booking Charges:</strong> Non-refundable upon cancellation.
          </li>
          <li>
            <strong>Enquiry Charges:</strong> Non-refundable upon cancellation.
          </li>
          <li>
            <strong>Artist Charges:</strong> Refund eligibility is subject to
            the artist’s refund policy. Please contact the artist directly for
            details.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold my-4">5. Rescheduling Policy</h2>
        <p className="mb-4">
          If you wish to reschedule your event, please contact us at least 14
          days before the original event date. Rescheduling is subject to the
          artist's availability and terms. Any booking or enquiry charges will
          still apply.
        </p>

        <h2 className="text-2xl font-semibold my-4">
          6. How to Inquire About an Artist's Refund Policy
        </h2>
        <p className="mb-4">
          When booking an artist, we recommend that you inquire about their
          specific refund policy. You can do this by:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            Using the messaging feature available on our platform to communicate
            directly with the artist.
          </li>
          <li>
            Reviewing the artist's profile for any listed terms regarding
            cancellations and refunds.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold my-4">7. Contact Us</h2>
        <p className="mb-4">
          If you have any questions regarding this Cancellation and Refund
          Policy or need assistance with your booking, please do not hesitate to
          contact us at:
        </p>
        <p>
          <strong>Email:</strong> support@gigsar.com
        </p>
        <p>
          <strong>Phone:</strong> +91 70216 30747
        </p>

        <p className="mb-4">
          Thank you for choosing Gigsar for your event needs. We are dedicated
          to ensuring a smooth and satisfactory experience for you and your
          guests.
        </p>
      </section>
    </div>
  );
};

export default CancellationRefundPolicy;
