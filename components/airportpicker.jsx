"use client";
import { Combobox } from "@headlessui/react";
import { useState, useEffect } from "react";

export default function AirportSelector({
  value,
  onValueChange,
  label,
  className,
  countryName,
}) {
  const [airports, setAirports] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/airports")
      .then((res) => res.json())
      .then((data) => {
        setAirports(data);

        // Auto-select airport if countryName is provided and no value yet
        if (countryName && !value) {
          const match = data.find(
            (airport) =>
              airport.Country.toLowerCase() === countryName.toLowerCase()
          );
          if (match) {
            onValueChange(match.AirportID);
          }
        }
      })
      .catch((err) => console.error("Failed to fetch airports", err));
  }, [countryName, value, onValueChange]);

  const filteredAirports =
    query === ""
      ? airports
      : airports.filter((airport) =>
          `${airport.City} ${airport.Country} ${airport.AirportName}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );

  return (
    <div className="w-full">
      <label className="text-md font-medium mb-1 block text-gray-200">{label}</label>
      <Combobox value={value} onChange={onValueChange}>
        <div className="relative">
          <Combobox.Input
            className={className}
            placeholder="Search airport"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(val) => {
              const selected = airports.find((a) => a.AirportID === val);
              return selected
                ? `${selected.City}, ${selected.Country} (${selected.IATA_Code})`
                : "";
            }}
          />
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg border text-sm">
            {filteredAirports.length === 0 ? (
              <div className="px-4 py-2 text-gray-500">No results found.</div>
            ) : (
              filteredAirports.map((airport) => (
                <Combobox.Option
                  key={airport.AirportID}
                  value={airport.AirportID}
                  className={({ active }) =>
                    `flex justify-between items-center px-4 py-2 cursor-pointer ${
                      active ? "bg-blue-100" : ""
                    }`
                  }
                >
                  <div>
                    <div className="font-medium">
                      {airport.City}, {airport.Country}
                    </div>
                    <div className="text-xs text-gray-500">{airport.AirportName}</div>
                  </div>
                  <div className="text-sm font-bold bg-gray-100 px-2 py-1 rounded">
                    {airport.IATA_Code}
                  </div>
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
}
