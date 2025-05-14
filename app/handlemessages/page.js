"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/contactUs/");
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleClick = async (msg) => {
    try {
      await axios.patch(`http://localhost:8080/api/contactus/${msg.UserContactID}/seen`);
      setMessages((prev) =>
        prev.map((m) =>
          m.UserContactID === msg.UserContactID ? { ...m, Seen: true } : m
        )
      );
      setExpandedId((prev) =>
        prev === msg.UserContactID ? null : msg.UserContactID
      );
    } catch (error) {
      console.error("Error marking as seen:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-white border-b border-blue-900 pb-2">
        Inbox Messages
      </h1>
      <div className="w-full max-w-2xl space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.UserContactID}
            onClick={() => handleClick(msg)}
            className={`rounded-2xl p-4 shadow-lg cursor-pointer transform transition-all duration-300
              ${msg.Seen ? "bg-[#2a2f32]" : "bg-[#1f2d22] hover:bg-[#2c3b2f]"}
              ${expandedId === msg.UserContactID ? "scale-[1.01] ring-2 ring-blue-900" : ""}
            `}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg text-blue-100">{msg.UName}</p>
                <p className="text-sm text-gray-400">{msg.Email}</p>
                <p className="text-sm text-gray-500">{msg.Phone}</p>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full 
                ${msg.Seen ? "bg-blue-900 text-white" : "bg-yellow-500 text-black"}`}
              >
                {msg.Seen ? "✓ Seen" : "• New"}
              </span>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedId === msg.UserContactID ? "max-h-96 mt-3" : "max-h-0"
              }`}
            >
              <div className="text-gray-200 text-sm border-t border-gray-600 pt-2 whitespace-pre-wrap">
                {msg.UMessage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactMessages;
