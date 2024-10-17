import { Outfit } from "next/font/google";
import Head from "next/head"; // Import Head for custom head elements
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Gigsar | Home Page",
  description:
    "Gigsar provides singers, live bands, musicians, instrumentalists, dj for events such as corporate events, college events, wedding events, house parties, private parties, virtual events. We offer a variety of singers, including playback singers, sufi singers, and live ghazal singers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KFRPRW6F');
            `,
          }}
        />
        {/* End Google Tag Manager */}
      </Head>
      <body className={outfit.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KFRPRW6F"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <div className="md:px-20">
          <Header />
          {children}
          <Toaster />
        </div>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
