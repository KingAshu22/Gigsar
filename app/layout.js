import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Gigsar | Home Page",
  description:
    "Gigsar provides singers, live bands, musicians, instrumentalists, dj for events such as corporate events, college events, wedding events, house parties, private parties, virtual events. We offer a variety of singers, including playback singers, sufi singers, and live ghazal singers",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className}>
          <div className="md:px-20">
            <Header>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </Header>
            {children}
            <Toaster />
          </div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
