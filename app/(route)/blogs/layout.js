import Footer from "@/app/_components/Footer";
import Header from "@/app/_components/Header";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: {
    default: "Gigsar Blog Page",
    template: "%s | Gigsar",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="">
          <Header />
          {children}
          <Toaster />
        </div>
        <Footer />
      </body>
    </html>
  );
}
