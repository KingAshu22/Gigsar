import { Button } from "@/components/ui/button";
import { useState } from "react";
import SendEnquiry from "./SendEnquiry";

const Sidebar = ({ artist, profilePic, name, artistType }) => {
  const [sendEnquiry, setSendEnquiry] = useState(false);
  return (
    <div className="col-span-12 lg:col-span-4 p-0 m-0">
      <div className="bg-slate-200 dark:bg-[#111111] rounded-2xl lg:mb-10 py-10 md:sticky top-24 left-0">
        <div className="overflow-hidden text-center w-60 h-60 m-auto">
          <img src={profilePic} className="rounded-3xl" />
        </div>
        <div className="text-center">
          <h2 className="mt-6 mb-1 text-4xl font-semibold dark:text-white">
            {name}
          </h2>
          <h1 className="mb-4 text-[#7B7B7B] inline-block dark:bg-[#1D1D1D] px-5 py-1.5 rounded-lg dark:text-[#A6A6A6] capitalize">
            {artistType?.replace("-", " ")}
          </h1>
        </div>
        {/* <div className="flex justify-center space-x-3">
            <a
              href="/"
              className="w-10 h-10 rounded bg-light-gray flex items-center justify-center shadow-md dark:bg-mid-dark hover:hover_active text-[#1773EA] hover:text-slate-50"
            >
              <FaFacebookF />
            </a>
            <a
              href="/"
              className="w-10 h-10 rounded bg-light-gray flex items-center justify-center shadow-md dark:bg-mid-dark hover:hover_active text-[#1C9CEA] hover:text-slate-50"
            >
              <AiOutlineTwitter />
            </a>
            <a
              href="/"
              className="w-10 h-10 rounded bg-light-gray flex items-center justify-center shadow-md dark:bg-mid-dark hover:hover_active text-[#e14a84] hover:text-slate-50"
            >
              <AiOutlineDribbble />
            </a>
            <a
              href="/"
              className="w-10 h-10 rounded bg-light-gray flex items-center justify-center shadow-md dark:bg-mid-dark hover:hover_active text-[#0072b1] hover:text-slate-50"
            >
              <RiLinkedinFill />
            </a>
          </div> */}
        {/* <ul className="flex flex-col bg-light-gray dark:bg-mid-dark px-7">
          <li className="flex items-center gap-6 border-b border-slate-300 py-3">
            <div className="w-10 h-10 rounded bg-light-gray flex items-center justify-center shadow-md dark:bg-[#111111] text-primary hover:hover_active group cursor-pointer">
              <Phone />
            </div>
            <div className="flex flex-col dark:text-white">
              <span className="text-slate-500 text-xs font-bold">Phone</span>
              <a
                className="transition-all duration-100 hover:text-primary"
                href="tel:+917021630747"
              >
                +91 70216 30747
              </a>
            </div>
          </li>
          <li className="flex items-center gap-6 border-b border-slate-300 py-3">
            <div className="w-10 h-10 rounded bg-light-gray flex items-center justify-center shadow-md dark:bg-black text-primary hover:hover_active group cursor-pointer text-xl">
              <MapPin />
            </div>
            <div className="flex flex-col dark:text-white">
              <span className="text-slate-500 text-xs font-bold">Location</span>
              <span className="transition-all duration-100">{location}</span>
            </div>
          </li>
        </ul> */}
        <div className="text-center">
          <Button
            className="rounded-3xl bg-gradient-to-r from-[#FA5252] to-[#DD2476] py-3 px-6 text-slate-50 inline-flex items-center gap-2 text-md"
            onClick={() => setSendEnquiry(true)}
          >
            Send Enquiry
          </Button>
        </div>
      </div>
      <SendEnquiry sendEnquiry={sendEnquiry} artist={artist} />
    </div>
  );
};

export default Sidebar;
