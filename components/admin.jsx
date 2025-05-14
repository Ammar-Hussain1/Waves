"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AirportSelector from "@/components/airportpicker";
import { useAuth } from "@/app/utilis/auth";
import Loader from "./loader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatDateTime = (dt) => {
  const date = new Date(dt);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.000`;
};

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("flight");

  const [flightNumber, setFlightNumber] = useState("");
  const [departureAirport, setDepartureAirport] = useState(null);
  const [arrivalAirport, setArrivalAirport] = useState(null);
  const [BPrice, setBPrice] = useState("");
  const [EPrice, setEPrice] = useState("");
  const [FPrice, setFPrice] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const [delayDuration, setDelayDuration] = useState("");
  const [delayFlightNumber, setDelayFlightNumber] = useState("");

  const { user, loading } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/signup?redirect=${encodeURIComponent(pathname)}`);
      } else if (user.UserType !== "Admin") {
        router.push("/");
      } else {
        setAuthChecked(true);
      }
    }
  }, [user, loading, router]);

  if (!authChecked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
        <Loader />
      </div>
    );
  }

  const clearFlightForm = () => {
    setDepartureAirport(null);
    setArrivalAirport(null);
    setDepartureTime("");
    setArrivalTime("");
    setBPrice("");
    setFPrice("");
    setEPrice("");
  };

  const clearDelayForm = () => {
    setDelayFlightNumber("");
    setDelayDuration("");
  };

  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    if (
      !departureAirport ||
      !arrivalAirport ||
      !FPrice ||
      !EPrice||
      !BPrice||
      !departureTime ||
      !arrivalTime
    ) {
      toast.error("Please fill in all flight details!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/flights/createFlight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
        DepartureAirport: departureAirport,
        ArrivalAirport: arrivalAirport,
        DepartureTime: formatDateTime(departureTime),
        ArrivalTime: formatDateTime(arrivalTime),
        EconomyPrice: parseInt(EPrice),
        BusinessClassPrice: parseInt(BPrice),
        FirstClassPrice: parseInt(FPrice),
      }),

      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Flight submitted successfully!");
        clearFlightForm();
      } else {
        toast.error(data.message || "Failed to submit flight.");
      }
    } catch (err) {
      console.error("API error:", err);
      toast.error("An error occurred while submitting flight data.");
    }
  };

 const handleDelaySubmit = async (e) => {
  e.preventDefault();

  if (!delayFlightNumber || !delayDuration) {
    toast.error("Please fill in flight number and delay duration.");
    return;
  }

  const regex = /(\d+)\s*(mins?|minutes?|hours?|hrs?)/i;
  const match = delayDuration.match(regex);

  if (!match) {
    toast.error("Invalid delay format. Use '45 mins' or '2 hours'.");
    return;
  }

  const delayAmount = parseInt(match[1]);
  let unit = match[2].toLowerCase();

 if (unit.includes("min")) unit = "minutes";
else if (unit.includes("hour") || unit.includes("hr")) unit = "hours";

  else {
    toast.error("Only 'minutes' or 'hours' units are supported.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/flights/addDelay/${delayFlightNumber}`,
      {
        method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ delayAmount, unit }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Delay info submitted successfully!");
        clearDelayForm();
      } else {
        toast.error(data.message || "Failed to submit delay.");
      }
    } catch (err) {
      console.error("Error submitting delay:", err);
      toast.error("An error occurred while submitting delay data.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
      <style>{`
        .Toastify__toast-container {
          z-index: 10000; /* Ensure it's on top of everything */
        }
      `}</style>
      {/* React Toastify Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("flight")}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
            activeTab === "flight" ? "bg-blue-600 text-white shadow-md" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Flight Details
        </button>
        <button
          onClick={() => setActiveTab("delay")}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
            activeTab === "delay" ? "bg-yellow-500 text-white shadow-md" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Delay Info
        </button>
      </div>

      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
        {activeTab === "flight" && (
          <form onSubmit={handleFlightSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Enter Flight Details</h2>
            <div className="relative z-0 text-black">
              <AirportSelector
                label="Departure Airport"
                value={departureAirport}
                onValueChange={setDepartureAirport}
                className="w-full p-3 bg-gray-700 rounded-md border text-white border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <AirportSelector
                label="Arrival Airport"
                value={arrivalAirport}
                onValueChange={setArrivalAirport}
                className="w-full p-3 bg-gray-700 rounded-md border text-white border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="number"
              placeholder="Economy Class Fare"
              value={EPrice}
              onChange={(e) => setEPrice(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md text-white"
            />
            <input
              type="number"
              placeholder="Business Class Fare"
              value={BPrice}
              onChange={(e) => setBPrice(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md text-white"
            />
            <input
              type="number"
              placeholder="First Class Fare"
              value={FPrice}
              onChange={(e) => setFPrice(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md text-white"
            />
            <input
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md text-white"
            />
            <input
              type="datetime-local"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md text-white"
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-semibold">
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
              value={delayFlightNumber}
              onChange={(e) => setDelayFlightNumber(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md text-white"
            />
            <input
              type="text"
              placeholder="Delay Duration (e.g., 45 mins)"
              value={delayDuration}
              onChange={(e) => setDelayDuration(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md text-white"
            />
            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 py-3 rounded-md font-semibold">
              Submit Delay
            </button>
          </form>
        )}
      </div>

      <div className="flex space-x-4 mb-8 mt-5">
        <button
          onClick={() => router.push("/handlerefunds")}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition"
        >
          Handle Refunds
        </button>
        <button
          onClick={() => router.push("/handlemessages")}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition"
        >
          Check Requests
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;