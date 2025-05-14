"use client";

import React, { useState } from "react";
import AirportSelector from "@/components/airportpicker"; // adjust path as needed
import FlightCard from "@/components/flightCard"; // adjust path as needed
import { useSearchParams } from 'next/navigation';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"; // Assuming this is shadcn/ui Select
import { Button } from "@/components/ui/button"; // Assuming this is shadcn/ui Button
import { Skeleton } from "@/components/ui/skeleton"; // Adjust path if needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FixedToFlightSearch = () => {
  const searchParams = useSearchParams();
  const countryName = searchParams.get('countryName');

  const [fromAirport, setFromAirport] = useState(null);
  const [toAirport, setToAirport] = useState(null);
  const [flightType, setFlightType] = useState(null);
  const [classType, setClassType] = useState(null);
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // For loading state

  const handleSearch = async () => {
    if (!fromAirport || !flightType || !classType) {
      toast.warn("Please fill all flight search fields!"); // Cool warning animation
      return;
    }

    setIsLoading(true); // Start loading
    setFlights([]); // Clear previous flights

    try {
      const res = await fetch("http://localhost:8080/api/flights/searchCountryFlight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAirport,
          toAirport: toAirport, // Explicitly passing toAirport, even if null for some logic
          flightType,
          flightClassType: classType,
        }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        toast.error(`Error fetching flights: ${res.statusText} - ${errorData}`); // Cool error animation
        setFlights([]);
        return;
      }

      const data = await res.json();
      setFlights(data || []);

    } catch (err) {
      toast.error("An error occurred while searching for flights. Please try again."); // Cool error animation
      setFlights([]); // Ensure flights are cleared on error
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <div className="p-4 space-y-8 max-w-3xl mx-auto">
      <style>{`
        .Toastify__toast-container {
          z-index: 10000; /* Ensure it's on top of everything */
        }
      `}</style>
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
      <h2 className="text-5xl text-center font-extralight my-16 text-white">
        Search Flights to {countryName || "your destination"}
      </h2>

      {/* Flight Picker Section - Made slightly bigger */}
      <div className="bg-zinc-900 border-none shadow-2xl rounded-xl p-8 space-y-8">

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-6">
          <AirportSelector
            label="From Airport"
            value={fromAirport}
            onValueChange={setFromAirport}
            className="w-full p-3 rounded-md border border-gray-700 placeholder-gray-500 text-white bg-zinc-800 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <AirportSelector
            label="To Airport"
            value={toAirport}
            onValueChange={setToAirport}
            countryName={countryName}
            className="w-full p-3 rounded-md border border-gray-700 placeholder-gray-500 text-white bg-zinc-800 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 text-white font-light">
          <div className="flex flex-col w-full sm:w-1/2">
            <label className="block mb-2 font-light text-sm">Flight Type</label>
            <Select onValueChange={setFlightType} value={flightType || undefined}>
              <SelectTrigger
                className="w-full bg-transparent text-white border border-gray-700 p-3 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <SelectValue placeholder="Select Flight Type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 text-white border-gray-700">
                <SelectItem value="one-way" className="hover:bg-zinc-700">One-way</SelectItem>
                <SelectItem value="round-trip" className="hover:bg-zinc-700">Round-trip</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col w-full sm:w-1/2">
            <label className="block mb-2 font-light text-sm">Class Type</label>
            <Select onValueChange={setClassType} value={classType || undefined}>
              <SelectTrigger
                className="w-full bg-transparent text-white border border-gray-700 p-3 rounded-md focus:ring-gray-500 focus:border-gray-500"
              >
                <SelectValue placeholder="Select Class Type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 text-white border-gray-700">
                <SelectItem value="Economy" className="hover:bg-zinc-700">Economy</SelectItem>
                <SelectItem value="Business" className="hover:bg-zinc-700">Business</SelectItem>
                <SelectItem value="First Class" className="hover:bg-zinc-700">First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-zinc-900 text-base font-extralight" // Adjusted button style for better appearance
          onClick={handleSearch}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "Searching..." : "Search Flights"}
        </Button>
      </div>

      {/* Flight Results Section */}
      <div className="mt-10 space-y-6">
        {isLoading ? (
          // Skeleton Loader
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-zinc-800 p-6 rounded-lg shadow-xl space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-2/5 bg-zinc-700 rounded" />
                <Skeleton className="h-5 w-1/5 bg-zinc-700 rounded" />
              </div>
              <Skeleton className="h-4 w-3/4 bg-zinc-700 rounded" />
              <Skeleton className="h-4 w-1/2 bg-zinc-700 rounded" />
              <div className="flex justify-end mt-2">
                <Skeleton className="h-8 w-1/4 bg-zinc-700 rounded-md" />
              </div>
            </div>
          ))
        ) : flights.length > 0 ? (
          flights.map((flight, idx) => (
            <FlightCard
              key={idx}
              flight={flight}
              flightType={flightType}
              flightClassDisplayName={classType} // Consider getting this from flight data if possible
            />
          ))
        ) : (
          <p className="text-center text-gray-400 py-8 text-lg">
            No flights found. Try adjusting your search criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default FixedToFlightSearch;