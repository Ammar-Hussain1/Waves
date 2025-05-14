"use client";
import React, { useState } from "react";

function EnterFlight() {
  const [activeTab, setActiveTab] = useState("flight");

  const [flightNumber, setFlightNumber] = useState("");
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [flightPrice, setFlightPrice] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const [delayDuration, setDelayDuration] = useState("");

  const clearFlightForm = () => {
    setFlightNumber("");
    setDepartureAirport("");
    setArrivalAirport("");
    setFlightPrice("");
    setDepartureTime("");
    setArrivalTime("");
  };

  const clearDelayForm = () => {
    setFlightNumber("");
    setDelayDuration("");
  };

  const handleFlightSubmit = (e) => {
    e.preventDefault();
    if (
      !flightNumber ||
      !departureAirport ||
      !arrivalAirport ||
      !flightPrice ||
      !departureTime ||
      !arrivalTime
    ) {
      alert("Please fill in all flight details.");
      return;
    }

    console.log({
      flightNumber,
      departureAirport,
      arrivalAirport,
      flightPrice,
      departureTime,
      arrivalTime,
    });

    alert("Flight submitted successfully!");
    clearFlightForm();
  };

  const handleDelaySubmit = (e) => {
    e.preventDefault();
    if (!flightNumber || !delayDuration) {
      alert("Please fill in flight number and delay duration.");
      return;
    }

    console.log({
      flightNumber,
      delayDuration,
    });

    alert("Delay info submitted successfully!");
    clearDelayForm();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("flight")}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
            activeTab === "flight"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Flight Details
        </button>
        <button
          onClick={() => setActiveTab("delay")}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
            activeTab === "delay"
              ? "bg-yellow-500 text-white shadow-md"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Delay Info
        </button>
      </div>

      {/* Content */}
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
        {activeTab === "flight" && (
          <form onSubmit={handleFlightSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Enter Flight Details</h2>
            <input
              type="text"
              placeholder="Flight Number"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Departure Airport"
              value={departureAirport}
              onChange={(e) => setDepartureAirport(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Arrival Airport"
              value={arrivalAirport}
              onChange={(e) => setArrivalAirport(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Flight Price"
              value={flightPrice}
              onChange={(e) => setFlightPrice(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="datetime-local"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
            >
              Submit Flight
            </button>
          </form>
        )}

        {activeTab === "delay" && (
          <form onSubmit={handleDelaySubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Add Delay Information</h2>
            <input
              type="text"
              placeholder="Flight Number"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="text"
              placeholder="Delay Duration (e.g., 45 mins)"
              value={delayDuration}
              onChange={(e) => setDelayDuration(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-md transition"
            >
              Submit Delay
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EnterFlight;
