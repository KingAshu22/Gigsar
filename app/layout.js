import { Outfit } from "next/font/google";
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
      <body className={outfit.className}>
        <div className="">
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
