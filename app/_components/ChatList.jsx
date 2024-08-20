"use client";

import React, { useEffect, useState } from "react";
import getProfilePic from "../helpers/profilePic";

// Helper function to truncate message content
const truncateMessage = (message, maxLength = 30) => {
  if (message.length > maxLength) {
    return message.substring(0, maxLength) + "...";
  }
  return message;
};

const formatTime = (timeStr) => {
  const date = new Date(timeStr);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday =
    new Date(now.setDate(now.getDate() - 1)).toDateString() ===
    date.toDateString();

  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-GB");
  }
};

const ChatList = ({ setSelectedChat, chats, socket }) => {
  const [profilePics, setProfilePics] = useState({});

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
    if (socket) {
      // Listen for new messages from the socket
      socket.on("message", (newMessage) => {
        // Update the chats with the new incoming message
        setSelectedChat((prevChats) => {
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

      // Clean up the event listener on unmount
      return () => {
        socket.off("message");
      };
    }
  }, [socket]);

  const getLastMessage = (messages) => {
    return messages[messages.length - 1];
  };

  // Sort chats based on the timestamp of the last message
  const sortedChats = [...chats].sort((a, b) => {
    const lastMessageA = getLastMessage(a.message);
    const lastMessageB = getLastMessage(b.message);
    const timeA = new Date(lastMessageA.time.$date || lastMessageA.time);
    const timeB = new Date(lastMessageB.time.$date || lastMessageB.time);
    return timeB - timeA; // Sort in descending order
  });

  return (
    <div className="bg-gray-100 border-r border-gray-300 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>
      <ul>
        {sortedChats.map((chat) => {
          const lastMessage = getLastMessage(chat.message);
          const isUnread = lastMessage.isUnread;

          return (
            <li
              key={chat.artistId}
              className="p-4 border-b border-gray-300 hover:bg-gray-200 cursor-pointer flex items-center"
              onClick={() => setSelectedChat(chat)}
            >
              {profilePics[chat.artistId] ? (
                <img
                  src={profilePics[chat.artistId].profilePic}
                  alt={profilePics[chat.artistId].name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
              )}
              <div className="flex-grow">
                <h3 className="text-md font-medium">
                  {profilePics[chat.artistId]?.name || chat.artistId}
                </h3>
                <p className="text-sm text-gray-600">
                  {truncateMessage(lastMessage.content)}
                </p>
              </div>
              <div className="flex items-center">
                {isUnread && (
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                )}
                <span className="text-xs text-gray-400 pt-8">
                  {formatTime(lastMessage.time.$date || lastMessage.time)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;
