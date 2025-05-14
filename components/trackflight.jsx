"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const TrackFlight = () => {
  const [flightNumber, setFlightNumber] = useState("");
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 const formatDateTimeUTC = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};


  const handleTrack = async () => {
    if (!flightNumber.trim()) return;
    setLoading(true);
    setError(null);
    setFlightData(null);

    try {
      const res = await fetch("http://localhost:8080/api/flights/trackflight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flightNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Flight not found");
      setFlightData(data[0]); // take the first result
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  className="relative flex flex-col overflow-hidden md:min-h-screen bg-zinc-950  text-white items-center justify-center md:px-6 md:py-6 md:pb-20"
>
  <motion.div
        initial={{ x: "-60vw", y: "-50vh", rotate: 8 }}
        animate={{ x: "-8vw", y: "-22vh", rotate: 0 }}
        transition={{ duration: 5, ease: "easeInOut" }}
        className="absolute z-0"
      >
        <img src="/plane.png" className="w-130 h-62" />
      </motion.div>

      <Card className={`relative z-2 bg-zinc-900 p-6  transition-all duration-500 ease-in-out ${
    flightData ? "w-full max-w-6xl" : "w-full max-w-lg"
  }`}>
 <CardContent className="space-y-6">
          <h2 className="text-4xl font-extralight text-white">Track Your Flight</h2>

          <div className="space-y-4">
            <Label htmlFor="flightNumber" className="text-white font-light">Flight Number</Label>
            <Input
              id="flightNumber"
              placeholder="e.g. EK215"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-2xl "
            />
          </div>

          <Button
            onClick={handleTrack}
            className="w-full bg-gray-600 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed mb-5"
            disabled={!flightNumber.trim() || loading}
          >
            {loading ? "Tracking..." : "Track Flight"}
          </Button>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {loading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 bg-zinc-700" />
              <Skeleton className="h-4 w-2/3 bg-zinc-700" />
              <Skeleton className="h-4 w-1/2 bg-zinc-700" />
            </div>
          )}

{flightData && (
  <div className="bg-zinc-900 rounded-2xl shadow-lg px-8 py-10 mt-6 grid grid-cols-1 md:grid-cols-2 gap-16 text-white text-[15px] md:text-[17px] tracking-wide leading-relaxed transition-all duration-300">
    <div>
      <h3 className="text-2xl font-extralight text-gray-300 mb-4 border-b border-gray-500 pb-2">Departure</h3>
      <p><span className="text-gray-200 font-light">Airport:</span> {flightData.DepartureAirportName}</p>
      <p><span className="text-gray-200 font-light">City:</span> {flightData.DepartureCity}</p>
      <p><span className="text-gray-200 font-light">Country:</span> {flightData.DepartureCountry}</p>
      <p><span className="text-gray-200 font-light"> Departure Time:</span> {formatDateTimeUTC(flightData.DepartureTime)}</p>
    </div>

    <div>
      <h3 className="text-2xl font-extralight text-gray-300 mb-4 border-b border-gray-500 pb-2">Arrival</h3>
      <p><span className="text-gray-200 font-light">Airport:</span> {flightData.ArrivalAirportName}</p>
      <p><span className="text-gray-200 font-light">City:</span> {flightData.ArrivalCity}</p>
      <p><span className="text-gray-200 font-light">Country:</span> {flightData.ArrivalCountry}</p>
      <p><span className="text-gray-200 font-light">Scheduled to Arrive at:</span> {formatDateTimeUTC(flightData.ArrivalTime)}</p>
     {flightData.DelayedStatus == 1 ? (
  <>
    <p><span className="text-red-300 font-light ">Delayed:</span> Yes</p>
    <p>
      <span className="text-red-300 font-light">New Arrival:</span>{" "}
      {formatDateTimeUTC(
        new Date(
          new Date(flightData.ArrivalTime).getTime() +
          (new Date(flightData.DelayedTime).getTime() - new Date(flightData.DepartureTime).getTime())
        ).toISOString()
      )}
    </p>
  </>
) : (
  <p>
    <span className="font-light">Arrival:</span>{" "}
    {formatDateTimeUTC(flightData.ArrivalTime)}
  </p>
)}

    </div>
  </div>
)}

        </CardContent>
      </Card>
    </div>
  );
};

export default TrackFlight;
