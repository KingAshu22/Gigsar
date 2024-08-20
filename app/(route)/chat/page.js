"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import io from "socket.io-client"; // Import Socket.io client
import ChatList from "@/app/_components/ChatList";
import ChatWindow from "@/app/_components/ChatWindow";
import withAuth from "@/lib/withAuth";
import getProfilePic from "@/app/helpers/profilePic";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [profilePics, setProfilePics] = useState({});
  const [socket, setSocket] = useState(null); // State for Socket.io instance
  const router = useRouter();

  useEffect(() => {
    // Initialize Socket.io connection
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      withCredentials: true,
    });
    setSocket(socket);

    // Clean up socket connection on component unmount
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchProfilePics = async () => {
      const picPromises = chats.map(async (chat) => {
        const { name, profilePic } = await getProfilePic(chat.artistId);
        return { artistId: chat.artistId, name, profilePic };
      });

      const pics = await Promise.all(picPromises);
      const picMap = pics.reduce((acc, { artistId, name, profilePic }) => {
        acc[artistId] = { name, profilePic };
        return acc;
      }, {});

      setProfilePics(picMap);
    };

    fetchProfilePics();
  }, [chats]);

  useEffect(() => {
    getClient();
  }, []);

  useEffect(() => {
    if (router.isReady) {
      const { artistId, ...details } = router.query;
      if (artistId) {
        createNewMessage(artistId, details);
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (newMessage) => {
        // Update chats with the new incoming message
        setChats((prevChats) => {
          const updatedChats = prevChats.map((chat) => {
            if (chat.artistId === newMessage.artistId) {
              return {
                ...chat,
                message: [...chat.message, newMessage.message],
              };
            }
            return chat;
          });

          // If the new message is from a new artist, add it to chats
          if (
            !updatedChats.some((chat) => chat.artistId === newMessage.artistId)
          ) {
            updatedChats.unshift({
              artistId: newMessage.artistId,
              message: [newMessage.message],
            });
          }

          return updatedChats;
        });
      });
    }
  }, [socket]);

  const getClient = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/client/contact/+${localStorage?.getItem(
          "mobile"
        )}`
      );

      if (response.data) {
        setChats(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching Client:", error);
      router.push("/user-dashboard/registration");
    }
  };

  const createNewMessage = async (artistId, details) => {
    const formattedMessage = formatMessage(details);
    const newMessage = {
      artistId,
      message: [
        {
          content: formattedMessage,
          time: new Date().toISOString(),
          isSenderMe: true,
          isUnread: false,
        },
      ],
    };

    setChats((prevChats) => [newMessage, ...prevChats]);
    setSelectedChat(newMessage);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/messages`,
        {
          artistId,
          contact: localStorage.getItem("mobile"),
          message: formattedMessage,
        }
      );

      // Emit the new message to the server via Socket.io
      socket.emit("sendMessage", {
        artistId,
        clientId: response.data.clientId, // assuming clientId comes from response
        message: {
          content: formattedMessage,
          time: new Date().toISOString(),
          isSenderMe: true,
          isUnread: false,
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatMessage = (details) => {
    let message = "New Booking Details:\n";
    for (const [key, value] of Object.entries(details)) {
      message += `${key.replace(/([A-Z])/g, " $1")}: ${decodeURIComponent(
        value
      )}\n`;
    }
    return message;
  };

  return (
    <div className="flex h-dvh">
      <div
        className={`w-full md:w-1/3 ${
          selectedChat ? "hidden md:block" : "block"
        }`}
      >
        <ChatList setSelectedChat={setSelectedChat} chats={chats} />
      </div>
      <div
        className={`w-full md:w-2/3 ${
          selectedChat ? "block" : "hidden md:block"
        }`}
      >
        {selectedChat && (
          <ChatWindow
            selectedChat={selectedChat}
            handleBack={() => setSelectedChat(null)}
            profilePic={profilePics[selectedChat.artistId]?.profilePic}
            socket={socket} // Pass socket instance to ChatWindow
          />
        )}
      </div>
    </div>
  );
};

export default withAuth(Chat);
