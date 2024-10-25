// pages/about.js
import Head from "next/head";
import Link from "next/link";

const About = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <Head>
        <title>About Us - Gigsar</title>
        <meta
          name="description"
          content="Learn more about Gigsar, your go-to platform for booking artists for events."
        />
      </Head>

      <h1 className="text-4xl font-bold my-6">About Gigsar</h1>

      <section className="max-w-2xl text-lg text-gray-800 text-justify">
        <p className="mb-4">
          Welcome to <strong>Gigsar</strong>, the comprehensive Artist Booking
          Platform designed to seamlessly connect event organizers with the
          perfect talent for any occasion. At Gigsar, we understand that finding
          the right artist is crucial to making your event truly unforgettable,
          whether it’s a wedding, corporate gathering, or private party.
        </p>

        <p className="mb-4">
          Our user-friendly platform empowers you to effortlessly browse and
          filter through a diverse range of artists. You can refine your search
          by type, event type, genre, location, budget, gender, and availability
          date, ensuring that you find exactly what you’re looking for. We
          believe that every event deserves exceptional talent, and Gigsar makes
          that possible with just a few clicks.
        </p>

        <p className="mb-4">
          One of the key features of Gigsar is our commitment to facilitating
          direct communication between you and your chosen artists. Our platform
          allows you to send inquiries, chat in real-time, and negotiate
          budgets, fostering a transparent and efficient booking process. This
          ensures that your needs are met and that both parties are aligned
          before the big day arrives.
        </p>

        <p className="mb-4">
          At Gigsar, our mission is to enhance your event experience by
          providing a curated selection of top-notch talent tailored to your
          specific requirements. Our team is passionate about connecting people
          through the power of music and performance, and we strive to make the
          booking process as smooth as possible for you.
        </p>

        <p className="mb-4">
          Our platform is not just about finding artists; it's about creating
          memorable experiences. We invite you to explore Gigsar and discover
          how we can help elevate your events with the right talent. Let us take
          the stress out of the booking process so you can focus on enjoying
          your occasion.
        </p>

        <p className="mb-4">
          Thank you for considering Gigsar as your go-to booking platform. We
          look forward to being a part of your next event!
        </p>
      </section>
    </div>
  );
};

export default About;
