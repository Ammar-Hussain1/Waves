// app/tickets/page.js (or your specific path)
"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import FlightCard from '@/components/flightCard'; // Adjust path if needed

const TicketsPageComponent = () => {
  const searchParams = useSearchParams();

  const flightType = searchParams.get('flightType');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const departure = searchParams.get('departure');
  const returnDateQuery = searchParams.get('return');

  const [flights, setFlights] = useState({
    economy: [],
    business: [],
    first: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('economy');

  const [clientFormattedDepartureDate, setClientFormattedDepartureDate] = useState('');
  const [isClient, setIsClient] = useState(false);

  const flightClassDefinitions = {
    economy: { apiValue: 'Economy', displayName: 'Economy' },
    business: { apiValue: 'Business', displayName: 'Business' },
    first: { apiValue: 'First Class', displayName: 'First Class' },
  };

  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    if (departure && isClient) {
      setClientFormattedDepartureDate(
        new Date(departure).toLocaleDateString('en-GB', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })
      );
    } else if (!departure && isClient) {
      setClientFormattedDepartureDate('N/A');
    }
  }, [departure, isClient]);


  useEffect(() => {
    if (flightType && from && to && departure) {
      setIsLoading(true);
      setError(null);

      const fetchAllFlights = async () => {
        try {
          const flightPromises = Object.keys(flightClassDefinitions).map(key => {
            const classDef = flightClassDefinitions[key];
            return axios.post('http://localhost:8080/api/flights/searchFlight', {
              flightType,
              fromAirport: from,
              toAirport: to,
              departureDate: departure,
              returnDate: returnDateQuery || "",
              flightClassType: classDef.apiValue,
            })
              .then(res => ({ classKey: key, data: res.data || [] }))
              .catch(err => {
                setError(prev => `${prev || ''} Failed to load ${classDef.displayName} flights. `);
                return { classKey: key, data: [] };
              });
          });


          const results = await Promise.all(flightPromises);
          const newFlightsState = results.reduce((acc, current) => {
            acc[current.classKey] = current.data;
            return acc;
          }, {});

          setFlights(prev => ({ ...prev, ...newFlightsState }));

        } catch (err) {
          setError("An unexpected error occurred while fetching flight information.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchAllFlights();
    } else {
      setIsLoading(false);
      if (searchParams.toString() && isClient) {
        setError("Missing required flight search parameters.");
      }
    }

  }, [flightType, from, to, departure, returnDateQuery, isClient]); // Added isClient

  const currentFlightList = flights[activeTab] || [];

  const displayDepartureDate = isClient ? clientFormattedDepartureDate : (departure ? "Loading date..." : "N/A");

  return (
    // Overall page container - dark background
    <div className="min-h-screen bg-zinc-950 py-8"> {/* Dark background */}
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
          {/* Date text - muted gray */}
          <h1 className="text-xl font-semibold text-gray-400"> {/* Muted gray */}
            {displayDepartureDate}
            {/* Flight count text - darker muted gray */}
            {isClient && !isLoading && flightType && <span className="ml-2 text-gray-600">({currentFlightList.length} options for {flightClassDefinitions[activeTab]?.displayName})</span>} {/* Darker muted gray */}
          </h1>
        </div>
        <div className="mb-6 flex items-center justify-between">
          {/* Class selection tabs - dark theme */}
          <div className="flex space-x-1 rounded-md bg-zinc-800 p-1"> {/* Dark background */}
            {Object.keys(flightClassDefinitions).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full rounded px-3 py-2 text-sm font-medium transition-colors duration-150 focus:outline-none
                  ${activeTab === key ? 'bg-zinc-700 text-gray-200 shadow' : 'text-gray-400 hover:bg-zinc-700'}`} 
              >
                {flightClassDefinitions[key].displayName}
              </button>
            ))}
          </div>
          {/* Sort dropdown - dark theme */}
          <div className="relative">
            <select className="rounded border border-zinc-700 bg-zinc-800 py-2 pl-3 pr-8 text-sm text-gray-400 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-700"> {/* Dark background, border, muted text, muted focus */}
              {/* Options will inherit text color */}
              <option>Sort: Lowest price</option>
            </select>
            {/* Optional: Add a custom arrow icon for the select dropdown if default one isn't dark theme friendly */}
          </div>
        </div>

        {/* Loading message - muted gray */}
        {isLoading && <div className="py-10 text-center text-gray-500">Loading flights...</div>} {/* Muted gray */}
        {/* Error message - muted red background and text */}
        {error && !isLoading && <div className="rounded-md bg-red-900/30 p-4 text-center text-red-400">{error}</div>} {/* Muted red background and text */}

        {/* Flight List or No Results Message */}
        {!isLoading && !error && flightType && isClient && ( // Ensure isClient before rendering list
          <div>
            {currentFlightList.length > 0 ? (
              currentFlightList.map((flight, idx) => (
                <FlightCard
                  key={flight.flightId || flight.OutboundFlightID || idx}
                  flight={flight}
                  flightType={flightType}
                  flightClassDisplayName={flightClassDefinitions[activeTab]?.displayName || activeTab}
                />
              ))
            ) : (
              // No results message - muted gray
              <div className="py-10 text-center text-gray-500"> {/* Muted gray */}
                No flights found for {flightClassDefinitions[activeTab]?.displayName} class with the current criteria.
              </div>
            )}
          </div>
        )}
        {/* Initial message when no search performed - muted gray */}
        {!isLoading && !error && !flightType && isClient && ( // Ensure isClient
          <div className="py-10 text-center text-gray-500"> {/* Muted gray */}
            Please perform a search to see flight results.
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper for Suspense - Style for dark theme
const TicketsPage = () => {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-zinc-950 text-gray-500">Loading page parameters...</div>}> {/* Dark background and muted text */}
      <TicketsPageComponent />
    </Suspense>
  );
};

export default TicketsPage;