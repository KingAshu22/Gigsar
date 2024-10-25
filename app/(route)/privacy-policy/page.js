// pages/privacy.js
import Head from "next/head";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <Head>
        <title>Privacy Policy - Gigsar</title>
        <meta
          name="description"
          content="Read the privacy policy of Gigsar regarding user data collection and protection."
        />
      </Head>

      <h1 className="text-4xl font-bold my-6">Privacy Policy</h1>

      <section className="max-w-2xl text-lg text-gray-800">
        <p className="mb-4">
          At Gigsar, we are committed to protecting your privacy. This Privacy
          Policy outlines how we collect, use, store, and protect your personal
          information when you use our platform. By using Gigsar, you agree to
          the collection and use of information in accordance with this policy.
        </p>

        <h2 className="text-2xl font-semibold my-4">
          1. Information We Collect
        </h2>
        <p className="mb-4">
          We collect the following personal information from our users during
          the registration process:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Name:</strong> To personalize your experience and facilitate
            communication.
          </li>
          <li>
            <strong>Email Address:</strong> To send you important updates,
            confirmations, and information related to your bookings.
          </li>
          <li>
            <strong>Mobile Number:</strong> To communicate with you regarding
            your bookings and provide customer support.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold my-4">
          2. How We Use Your Information
        </h2>
        <p className="mb-4">
          We use the collected information for the following purposes:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            To facilitate the booking process and connect you with artists.
          </li>
          <li>
            To communicate with you regarding your inquiries and bookings.
          </li>
          <li>To provide customer support and respond to your queries.</li>
          <li>
            To send you promotional materials and updates, if you have opted to
            receive them.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold my-4">
          3. Data Storage and Security
        </h2>
        <p className="mb-4">
          Your personal information is securely stored in our MongoDB database.
          We implement appropriate technical and organizational measures to
          protect your data from unauthorized access, loss, or misuse. While we
          strive to use commercially acceptable means to protect your personal
          information, we cannot guarantee its absolute security.
        </p>

        <h2 className="text-2xl font-semibold my-4">
          4. Sharing Your Information
        </h2>
        <p className="mb-4">
          We do not sell, trade, or otherwise transfer your personal information
          to outside parties without your consent, except in the following
          circumstances:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>If required by law or in response to legal requests.</li>
          <li>
            To protect our rights, privacy, safety, or property, or that of
            others.
          </li>
          <li>
            In connection with a merger, sale of company assets, or acquisition.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold my-4">5. Your Rights</h2>
        <p className="mb-4">You have the right to:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Access the personal information we hold about you.</li>
          <li>Request the correction of any inaccurate information.</li>
          <li>
            Request the deletion of your personal information, subject to legal
            obligations.
          </li>
          <li>
            Withdraw your consent for us to process your personal information at
            any time.
          </li>
        </ul>
        <p className="mb-4">
          To exercise any of these rights, please contact us using the
          information provided below.
        </p>

        <h2 className="text-2xl font-semibold my-4">
          6. Cookies and Tracking Technologies
        </h2>
        <p className="mb-4">
          Our platform may use cookies and similar tracking technologies to
          enhance user experience. You can choose to accept or decline cookies
          through your browser settings. However, declining cookies may prevent
          you from taking full advantage of the website.
        </p>

        <h2 className="text-2xl font-semibold my-4">
          7. Changes to This Privacy Policy
        </h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page. You are
          advised to review this Privacy Policy periodically for any changes.
          Changes to this policy are effective when they are posted on this
          page.
        </p>

        <h2 className="text-2xl font-semibold my-4">8. Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns about this Privacy Policy or our
          data practices, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> support@gigsar.com
        </p>
        <p>
          <strong>Phone:</strong> +91 70216 30747
        </p>

        <p className="mb-4">
          Thank you for trusting Gigsar with your personal information. We are
          dedicated to maintaining your privacy and ensuring a safe user
          experience.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
