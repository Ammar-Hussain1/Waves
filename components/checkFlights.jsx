"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/date";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AirportSelector from "@/components/airportpicker";
import { useRouter } from "next/navigation";

function FlightPicker() {
  const [flightType, setFlightType] = useState("round-trip");
  const [fromAirport, setFromAirport] = useState(null);
  const [toAirport, setToAirport] = useState(null);
  const [departureDate, setDepartureDate] = useState(null); // Change here
  const [returnDate, setReturnDate] = useState(null); // Change here

  const router = useRouter();

  const handleFlightTypeChange = (value) => {
    setFlightType(value);
    if (value === "one-way") {
      setReturnDate(null);
    }
  };

  const handleSearch = async () => {

      const query = new URLSearchParams({
      flightType,
      from: fromAirport,
      to: toAirport,
      departure: departureDate || "",
      return: returnDate || "",
    }).toString();

    router.push(`/tickets?${query}`);
  };

  return (
    <div className="relative">
      <div className="md:absolute md:top-[-700px] md:left-1/2 md:transform md:-translate-x-1/2 w-full px-4 sm:px-6 lg:px-0 max-w-4xl mt-2">
        <div className="bg-transparent p-6 sm:p-10 shadow-lg w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <RadioGroup value={flightType} onValueChange={handleFlightTypeChange} className="flex gap-6">
              <div className="flex items-center">
                <RadioGroupItem value="one-way" id="one-way" />
                <label htmlFor="one-way" className="ml-2 text-base sm:text-lg text-white">One-way</label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="round-trip" id="round-trip" />
                <label htmlFor="round-trip" className="ml-2 text-base sm:text-lg text-white">Round-trip</label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 mb-6 ">
            <AirportSelector label="From Airport" value={fromAirport} onValueChange={setFromAirport}
             className="w-full p-3 rounded-md border border-gray-400 placeholder-gray-500 text-white"
            />
            <AirportSelector label="To Airport" value={toAirport} onValueChange={setToAirport}
               className="w-full p-3 rounded-md border border-gray-400 placeholder-gray-500 text-white" />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 mb-6">
            <DatePicker label="Departure Date" value={departureDate} onChange={setDepartureDate} />
            {flightType === "round-trip" && (
              <DatePicker label="Return Date" value={returnDate} onChange={setReturnDate} />
            )}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleSearch}
              className="w-full sm:w-auto px-6 py-6 bg-white text-blackrounded-lg hover:bg-gray-400 transition duration-300 text-lg shadow-md"
            >
              Check Flights
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightPicker;
