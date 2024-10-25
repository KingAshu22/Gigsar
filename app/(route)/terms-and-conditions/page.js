// pages/terms.js
import Head from "next/head";

const TermsAndConditions = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <Head>
        <title>Terms and Conditions - Gigsar</title>
        <meta
          name="description"
          content="Read the terms and conditions of using Gigsar, the artist booking platform."
        />
      </Head>

      <h1 className="text-4xl font-bold my-6">Terms and Conditions</h1>

      <section className="max-w-2xl text-lg text-gray-800 text-justify">
        <p className="mb-4">
          Welcome to Gigsar! These Terms and Conditions govern your use of our
          platform and services. By accessing or using Gigsar, you agree to
          comply with these terms. If you do not agree, please refrain from
          using our services.
        </p>

        <h2 className="text-2xl font-semibold my-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By creating an account, you confirm that you are at least 18 years old
          or that you have parental consent to use our platform. You agree to
          provide accurate and complete information when registering and to keep
          your account information up to date.
        </p>

        <h2 className="text-2xl font-semibold my-4">2. Services Provided</h2>
        <p className="mb-4">
          Gigsar provides an online platform for event organizers to connect
          with artists for various events. We facilitate the booking process by
          allowing users to browse, filter, and communicate with artists
          directly. While we strive to maintain high standards of quality, we do
          not guarantee the performance or availability of any artist.
        </p>

        <h2 className="text-2xl font-semibold my-4">
          3. User Responsibilities
        </h2>
        <p className="mb-4">
          Users agree to use the platform responsibly and not to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Provide false or misleading information.</li>
          <li>
            Engage in any activity that disrupts or interferes with the
            platform's functionality.
          </li>
          <li>
            Attempt to gain unauthorized access to any part of the platform or
            its systems.
          </li>
          <li>Use the platform for any illegal or unauthorized purpose.</li>
        </ul>

        <h2 className="text-2xl font-semibold my-4">4. Booking and Payment</h2>
        <p className="mb-4">
          When you book an artist through Gigsar, you enter into a direct
          agreement with that artist. Gigsar may charge a service fee in
          addition to the artist’s fee. Payment terms and conditions will be
          outlined during the booking process, and users agree to comply with
          those terms.
        </p>

        <h2 className="text-2xl font-semibold my-4">
          5. Cancellation and Refunds
        </h2>
        <p className="mb-4">
          Cancellation policies vary by artist and will be communicated at the
          time of booking. Users must refer to the specific terms provided by
          the artist regarding cancellations and refunds. Gigsar is not
          responsible for any disputes arising from cancellation terms.
        </p>

        <h2 className="text-2xl font-semibold my-4">
          6. Intellectual Property
        </h2>
        <p className="mb-4">
          All content on the Gigsar platform, including text, graphics, logos,
          and software, is the property of Gigsar or its licensors. Users are
          granted a limited, non-exclusive license to access and use the
          platform for personal, non-commercial purposes only. Any unauthorized
          use of our content is prohibited.
        </p>

        <h2 className="text-2xl font-semibold my-4">
          7. Limitation of Liability
        </h2>
        <p className="mb-4">
          Gigsar will not be liable for any direct, indirect, incidental, or
          consequential damages arising from your use of the platform or
          services, including but not limited to any loss of profits, data, or
          goodwill. Users acknowledge that Gigsar is not responsible for the
          actions or omissions of artists and any disputes must be resolved
          between the user and the artist.
        </p>

        <h2 className="text-2xl font-semibold my-4">8. Indemnification</h2>
        <p className="mb-4">
          Users agree to indemnify and hold Gigsar, its affiliates, and their
          respective officers, directors, and employees harmless from any
          claims, damages, losses, or expenses arising from their use of the
          platform, violation of these terms, or violation of any rights of
          another party.
        </p>

        <h2 className="text-2xl font-semibold my-4">9. Changes to Terms</h2>
        <p className="mb-4">
          Gigsar reserves the right to modify these Terms and Conditions at any
          time. Users will be notified of any changes, and continued use of the
          platform after changes indicates acceptance of the new terms.
        </p>

        <h2 className="text-2xl font-semibold my-4">10. Governing Law</h2>
        <p className="mb-4">
          These Terms and Conditions shall be governed by and construed in
          accordance with the laws of Mumbai, India, without regard to its
          conflict of law principles. Any disputes arising from these terms
          shall be subject to the exclusive jurisdiction of the courts located
          in Mumbai, India.
        </p>

        <h2 className="text-2xl font-semibold my-4">11. Contact Information</h2>
        <p className="mb-4">
          If you have any questions or concerns regarding these Terms and
          Conditions, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> support@gigsar.com
        </p>

        <p className="mb-4">
          Thank you for using Gigsar! We look forward to helping you connect
          with incredible talent for your events.
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditions;
