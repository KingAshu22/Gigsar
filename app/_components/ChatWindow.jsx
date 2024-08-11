"use client";

import React, { useEffect, useState, useRef } from "react";
import getProfilePic from "../helpers/profilePic";
import { ChevronLeft, SendHorizonal } from "lucide-react";
import Link from "next/link";
import axios from "axios";

// Utility function to capitalize each word
const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Utility function to format date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Utility function to format time without seconds and in 12-hour format
const formatTime = (timeStr) => {
  const date = new Date(timeStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const ChatWindow = ({ selectedChat, handleBack }) => {
  const [profilePic, setProfilePic] = useState("");
  const [name, setName] = useState(selectedChat.artistId);
  const [messages, setMessages] = useState(selectedChat.message);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { name, profilePic } = await getProfilePic(selectedChat.artistId);
      setName(name);
      setProfilePic(profilePic);
    };

    fetchProfile();
  }, [selectedChat]);

  useEffect(() => {
    setMessages(selectedChat.message);
  }, [selectedChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    inputRef.current.focus();
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevents the default action of the Enter key
        handleSendMessage();
      }
    };

    const input = inputRef.current;
    input.addEventListener("keydown", handleKeyDown);

    return () => {
      input.removeEventListener("keydown", handleKeyDown);
    };
  }, [newMessage]);

  useEffect(() => {
    const adjustScrollPosition = () => {
      if (inputRef.current) {
        const textareaTop = inputRef.current.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;

        if (textareaTop > viewportHeight - 50) {
          window.scrollTo({
            top: textareaTop - viewportHeight + 50,
            behavior: "smooth",
          });
        }
      }
    };

    inputRef.current.addEventListener("focus", adjustScrollPosition);

    return () => {
      inputRef.current.removeEventListener("focus", adjustScrollPosition);
    };
  }, []);

  const formatMessageContent = (content) => {
    return content
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line, index) => {
        if (line.startsWith("Date: ")) {
          return (
            <p key={index}>
              {capitalizeWords(line.split(": ")[0])}:{" "}
              {formatDate(line.split(": ")[1])}
            </p>
          );
        }
        return <p key={index}>{capitalizeWords(line)}</p>;
      });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API}/client-custom-message`,
          {
            contact: `+${localStorage?.getItem("mobile")}`,
            artistId: selectedChat.artistId,
            message: {
              content: newMessage,
              time: new Date().toISOString(),
              isSenderMe: true,
              isUnread: false,
            },
          },
          { withCredentials: true }
        );

        setMessages([
          ...messages,
          {
            content: newMessage,
            time: new Date().toISOString(),
            isSenderMe: true,
          },
        ]);
        setNewMessage("");
      } catch (error) {
        // Handle error
        console.error("Error submitting form:", error);
        toast.error("Error sending message");
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-300 flex items-center">
        <button className="md:hidden mr-2" onClick={handleBack}>
          <ChevronLeft />
        </button>
        <Link href={`/artist/${selectedChat.artistId}`}>
          <div className="flex items-center space-x-4">
            <img
              src={profilePic}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <h2 className="text-lg font-semibold">{name}</h2>
          </div>
        </Link>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              message.isSenderMe ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                message.isSenderMe
                  ? "bg-primary text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              <div>{formatMessageContent(message.content)}</div>
              <span className="block text-xs mt-1 text-right">
                {formatTime(message.time.$date || message.time)}
              </span>
            </div>
            <div ref={messagesEndRef} />
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-300 flex items-center space-x-2">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          ref={inputRef}
        />
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg"
          onClick={handleSendMessage}
        >
          <SendHorizonal />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
