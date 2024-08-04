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
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const ChatList = ({ setSelectedChat, chats }) => {
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

  const getLastMessage = (messages) => {
    return messages[messages.length - 1];
  };

  return (
    <div className="bg-gray-100 border-r border-gray-300 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>
      <ul>
        {[...chats].reverse().map((chat) => {
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
                <span className="text-xs text-gray-400">
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
