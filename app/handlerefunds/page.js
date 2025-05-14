"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const TABS = ["Processing", "Completed", "Rejected"];

export default function RefundsPanel() {
  const [activeTab, setActiveTab] = useState("Processing");
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
    fetchRefunds(activeTab);
  }, [activeTab]);

  const fetchRefunds = async (status) => {
    try {
      const endpoint =
        status === "Processing"
          ? "/api/refunds/Processing"
          : status === "Completed"
          ? "/api/refunds/Completed"
          : "/api/refunds/Rejected";

      const res = await axios.get(`http://localhost:8080${endpoint}`);
      setRefunds(res.data);
    } catch (error) {
      console.error("Error fetching refunds:", error);
    }
  };
const handleUpdate = async (refund, newStatus) => {
    try {
        console.log("Sending update for refundId:", refund.RefundID); 
        await axios.patch(`http://localhost:8080/api/refunds/${refund.RefundID}/${newStatus}`);

        // After updating, refetch refunds for all tabs
        fetchRefunds("Processing");
        fetchRefunds("Completed");
        fetchRefunds("Rejected");

        setRefunds((prev) =>
            prev.map((r) =>
                r.RefundID === refund.RefundID ? { ...r, status: newStatus } : r
            )
        );
        
    } catch (error) {
        console.error("Error updating refund status:", error);
    }
};

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6 pt-10">
      <h1 className="text-3xl font-bold mb-6 border-b border-blue-800 pb-2 text-center">
        Refund Requests
      </h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full ${
              activeTab === tab
                ? "bg-blue-800 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Refund List */}
      <div className="space-y-4">
        {refunds.map((refund) => (
          <div
            key={refund.RefundID}
            className="bg-[#1c1f24] p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">#{refund.RefundID}</p>
              <p className="text-gray-400 text-sm">
                User: {refund.UserName} — Flight: {refund.FlightNumber}
              </p>
              <p className="text-gray-500 text-sm">Reason: {refund.Reason}</p>
            </div>

            {activeTab === "Processing" ? (
              <div className="space-x-2">
                <button
                  className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded"
                  onClick={() => handleUpdate(refund, "Completed")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
                  onClick={() => handleUpdate(refund, "Rejected")}
                >
                  Reject
                </button>
              </div>
            ) : (
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  activeTab === "Completed"
                    ? "bg-green-700"
                    : "bg-red-700"
                }`}
              >
                {activeTab}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
