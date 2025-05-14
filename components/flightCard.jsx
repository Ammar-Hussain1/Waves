"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Re-evaluating icon colors to fit the dark theme better (keeping original colors, adjusting size)
// Plane icon - made white as requested
const IconPlaneTakeoff = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>; // Increased size and margin, text-white
const IconChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1 transition-transform duration-200 ease-in-out text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>; // Increased size
const IconChevronUp = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1 transition-transform duration-200 ease-in-out text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>; // Increased size
const IconLuggage = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm4 14a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" /></svg>; // Increased size and margin
const IconInfo = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>; // Increased size and margin

// New Close Icon
const IconClose = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors duration-200"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;


const FlightCard = ({ flight, flightType, flightClassDisplayName }) => {
  if (!flight) return null;

  const [detailsOpenOneWay, setDetailsOpenOneWay] = useState(false);
  const [detailsOpenOutbound, setDetailsOpenOutbound] = useState(false);
  const [detailsOpenReturn, setDetailsOpenReturn] = useState(false);
  const [bookingInfoOpen, setBookingInfoOpen] = useState(false);


  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "--:--";
    return new Date(dateTimeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    return new Date(dateTimeString).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const router = useRouter();

  const handleSelectAndProceed = (selectedFlight) => {
    localStorage.setItem("selectedFlight", JSON.stringify(selectedFlight));
    localStorage.setItem("class", flightClassDisplayName);
    localStorage.setItem("type", flightType);
    router.push(`/enterinfo`);
  };

  const renderFlightSegmentUI = (segmentData, segmentType) => {
    const {
      departureTime, arrivalTime,
      departureAirportName, arrivalAirportName,
      departureCity, arrivalCity, // Assuming DepartureCountry not needed for airport name display directly
      flightNumber, availableSeats,
      airlineName = "Fly Emirates", // Default or from data
      airlineLogoUrl = "/planeicon.png", // Placeholder Emirates Logo
      duration, connections, // These should be pre-calculated or in segmentData
      aircraftType = "Boeing 777", // Example data
      layoverInfo = "No layover", // Example data
      isDetailsDropdownOpen,
      toggleDetailsDropdown,
    } = segmentData;

    const connectionText = connections === 0 ? "Direct" : `${connections} stop${connections > 1 ? 's' : ''}`;

    return (
      <div className="segment mb-6 last:mb-0"> {/* Increased bottom margin */}
        {flightType === 'round-trip' && (
          // Muted date text - slightly larger
          <p className="text-base font-semibold text-gray-500 mb-3"> {/* Increased text size and margin */}
            {segmentType === 'outbound' ? `Outbound: ${formatDate(departureTime)}` : `Return: ${formatDate(departureTime)}`}
          </p>
        )}
        <div className="flex items-start">
          {/* Airline logo - increased size */}
          <img src={airlineLogoUrl} alt={`${airlineName} logo`} className="h-12 w-12 mr-5 mt-1 rounded-sm object-contain border border-zinc-700 bg-white p-1" /> {/* Increased size and margin */}
          <div className="flex-grow">
            <div className="grid grid-cols-3 items-center gap-x-4"> {/* Increased gap */}
              <div className="text-left">
                {/* Time text - larger */}
                <p className="text-2xl font-bold text-gray-200">{formatTime(departureTime)}</p> {/* Increased text size */}
                {/* Airport/City text - slightly larger muted gray */}
                <p className="text-base text-gray-400">{departureAirportName?.split(' ')[0] || departureCity}</p> {/* Increased text size */}
              </div>
              <div className="text-center">
                {/* Duration text - slightly larger muted gray */}
                <p className="text-sm text-gray-500">{duration}</p> {/* Increased text size */}
                {/* Separator line - darker */}
                <div className="w-full h-1 bg-zinc-700 my-2 relative"> {/* Increased height and margin */}
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-gray-500"></span> {/* Increased size */}
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-gray-500"></span> {/* Increased size */}
                </div>
                {/* Connection text - slightly larger desaturated accent colors */}
                <p className={`text-sm font-medium ${connections > 0 ? 'text-white' : 'text-red-400'}`}> {/* Muted orange/green */}
                  {connectionText}
                </p>
              </div>
              <div className="text-right">
                {/* Time text - larger */}
                <p className="text-2xl font-bold text-gray-200">{formatTime(arrivalTime)}</p> {/* Increased text size */}
                {/* Airport/City text - slightly larger muted gray */}
                <p className="text-base text-gray-400">{arrivalAirportName?.split(' ')[0] || arrivalCity}</p> {/* Increased text size */}
              </div>
            </div>
            <div className="mt-3 flex justify-between items-center"> {/* Increased top margin */}
              {/* Airline/Flight number text - slightly larger muted gray */}
              <p className="text-sm text-gray-500"> {/* Increased text size */}
                {airlineName} {flightNumber}
                {/* Sold Out text - muted red */}
                {availableSeats > 0 ? ` (${availableSeats} seats)` : <span className="font-semibold text-red-700"> (Sold Out)</span>}
              </p>
              {/* Details button - slightly larger muted blue, subtle hover */}
              <button
                onClick={toggleDetailsDropdown}
                className="text-sm text-yellow-500 hover:text-yellow-300 flex items-center transition-colors duration-300"
              >
                Flight details {isDetailsDropdownOpen ? <IconChevronUp /> : <IconChevronDown />}
              </button>
            </div>
          </div>
        </div>
        {/* Expandable Details Section - dark background, larger padding, increased ml */}
        {isDetailsDropdownOpen && (
          <div className="mt-4 ml-20 p-4 bg-zinc-800 rounded-md border border-zinc-700 animate-fadeIn"> {/* Increased margins and padding */}
            {/* Details text - slightly larger muted gray */}
            <p className="text-base font-semibold text-gray-300 mb-2"> {/* Increased text size and margin */}
              Aircraft: <span className="font-normal text-gray-400">{aircraftType}</span>
            </p> {/* Muted text */}

            <p className="text-base font-semibold text-gray-300 mb-2"> {/* Increased text size and margin */}
              Luggage Allowance: <span className="font-normal text-gray-400">1 checked bag (23kg) + 1 carry-on</span>
            </p>

            <p className="text-base font-semibold text-gray-300 mb-2"> {/* Increased text size and margin */}
              Meal: <span className="font-normal text-gray-400">Included – Chicken or Vegetarian</span>
            </p>

            <p className="text-base font-semibold text-gray-300 mb-2"> {/* Increased text size and margin */}
              Seat Type: <span className="font-normal text-gray-400">Economy – Window</span>
            </p>

            <p className="text-base font-semibold text-gray-300 mb-2"> {/* Increased text size and margin */}
              In-flight Entertainment: <span className="font-normal text-gray-400">Available</span>
            </p>

             <p className="text-base font-semibold text-gray-300 mb-2"> {/* Increased text size and margin */}
              Boarding Gate: <span className="font-normal text-gray-400">A12</span>
            </p>

            {connections > 0 && <p className="text-base font-semibold text-gray-300">Layover: <span className="font-normal text-gray-400">{layoverInfo}</span></p>} {/* Increased text size */}
            {/* Operated by text - slightly larger muted gray */}
            <p className="text-sm text-gray-500 mt-2">Operated by {airlineName}</p> {/* Increased text size and margin */}
          </div>
        )}
      </div>
    );
  };

  const flightId = flight.id || flight.FlightID || `flight-${Math.random().toString(16).slice(2)}`;

  const commonFlightData = {
    airlineName: flight.AirlineName || "Fly Emirates",
    airlineLogoUrl: flight.AirlineLogoUrl || "/planeicon.png",
    aircraftType: flight.AircraftType || "Boeing 777",
  };


  // --- One-Way Flight ---
  if (flightType === 'one-way') {
    const oneWaySegmentData = {
      ...commonFlightData,
      departureTime: flight.DepartureTime,
      arrivalTime: flight.ArrivalTime,
      departureAirportName: flight.DepartureAirportName,
      arrivalAirportName: flight.ArrivalAirportName,
      departureCity: flight.DepartureCity,
      arrivalCity: flight.ArrivalCity,
      flightNumber: flight.flightNumber,
      availableSeats: flight.AvailableSeats,
      duration: calculateDuration(flight.DepartureTime, flight.ArrivalTime),
      connections: flight.Connections || 0,
      layoverInfo: flight.LayoverInfo || (flight.Connections > 0 ? "Details unavailable" : "Direct flight"),
      isDetailsDropdownOpen: detailsOpenOneWay,
      toggleDetailsDropdown: () => setDetailsOpenOneWay(!detailsOpenOneWay),
    };
    const isSoldOut = flight.AvailableSeats <= 0;

    return (
      // Card container - dark background, subtle border, subtle shadow on hover, increased padding
      <div className="mb-8 rounded-lg border border-zinc-700 bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-300"> {/* Increased bottom margin */}
        <div className="p-6"> {/* Increased padding */}
          {renderFlightSegmentUI(oneWaySegmentData, 'one-way')}
        </div>
        {/* Price and Booking Action Bar - slightly different dark background, increased padding */}
        <div className="bg-zinc-800 px-6 py-4 border-t border-zinc-700 flex flex-col sm:flex-row items-center justify-between"> {/* Increased padding */}
          <div className="mb-3 sm:mb-0"> {/* Increased bottom margin */}
            {/* Class text - slightly larger muted gray */}
            <p className="text-sm text-gray-500">{flightClassDisplayName} class</p> {/* Increased text size */}
            {/* Price text - larger desaturated gold/green */}
            <p className="text-2xl font-bold text-white"> {/* Increased text size */}
              EUR {flight.Price?.toFixed(2)}
            </p>
          </div>
          <div className="relative text-black"> {/* Removed stray 'text-black' here */}
            {/* Book Button - Larger padding, Plane icon inside made white */}
            <button
              onClick={() => !isSoldOut && setBookingInfoOpen(!bookingInfoOpen)}
              disabled={isSoldOut}
              // Button styled white with black text as per your provided snippet
              className={`bg-white text-black font-semibold py-3 px-6 rounded-md shadow-sm hover:bg-gray-300 transition duration-150 ease-in-out flex items-center ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* IconPlaneTakeoff is rendered here */}
             {/* Note: IconPlaneTakeoff is set to text-white, which will be invisible on a white button */}
              {isSoldOut ? "Sold Out" : "Book Flight"}
            </button>
            {/* Booking Info Popup - dark background, increased padding, now appears below */}
            {bookingInfoOpen && !isSoldOut && (
              // Positioning changed from bottom-full + mb-3 to top-full + mt-3
              <div className="absolute right-0 top-full mt-3 w-80 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl p-5 z-20 animate-fadeInUp"> {/* Increased width, top margin, and padding */}
                {/* Close Button */}
                <button
                    onClick={() => setBookingInfoOpen(false)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-zinc-700 transition-colors duration-200"
                    aria-label="Close"
                >
                    <IconClose />
                </button>

                {/* Popup header - slightly larger muted gray */}
                <h5 className="text-lg font-semibold text-gray-200 mb-4 flex items-center"><IconInfo />Fare Information</h5> {/* Increased text size and margin */}
                {/* Popup text - slightly larger muted gray */}
                <ul className="text-base text-gray-400 space-y-3"> {/* Increased text size and spacing */}
                  <li className="flex items-start"><IconLuggage /><span className="ml-1">Baggage: {flight.BaggageAllowance?.Checked || "1pc, 23kg (standard)"}</span></li>
                  {/* Added fake info */}
                  <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m0 0 3.181 3.181Nm0-7.424-3.181 3.181m0 0-3.181-3.181m3.181 3.181L15.04 9.348m6.613 1.328c1.11.336 2.211.668 3.291.992M3.49 19.602l-.742 2.228ª9.185 9.185 0 0 0 6.405.998H9.72m.06-1.506.329-.892M13.672 13.01a.995.995 0 0 1 1.393-.11C16.002 13.417 17 14.47 17 15.75c0 .81-.338 1.58-.93 2.14L12 20.25v-4.72m4.26-4.26H10.5" />
                      </svg>
                      <span className="ml-1">Changes: Fees apply ({flightType === 'one-way' ? 'non-refundable' : 'rebooking fee'})</span>
                  </li>
                   <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-.698m-.E2 1.838A23.858 23.858 0 0 1 12 20.522 23.848 23.848 0 0 1 3.373 17.082m16.E2 1.838c-.32-.308-.651-.608-.992-.902M3.373 17.082a23.848 23.848 0 0 0 5.454-.698m-.E2 1.838A23.858 23.858 0 0 1 12 20.522 23.848 23.848 0 0 1 3.373 17.082" />
                      </svg>
                      <span className="ml-1">Frequent Flyer: Accrue miles (specific to airline program)</span>
                  </li>
                   <li className="flex items-start">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm4 14a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" />
                      </svg>
                      <span className="ml-1">Seat Selection: Available for a fee</span>
                   </li>
                   <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-gray-500">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                       </svg>
                       <span className="ml-1">Check-in: Opens 48 hours before departure</span>
                   </li>
                   <li className="flex items-start">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                       </svg>
                       <span className="ml-1">Refunds: Subject to fare rules</span>
                   </li>
                  {/* End of added fake info */}
                  <li className="text-sm text-gray-500 pt-2">Full conditions apply. Seat selection may be extra.</li> {/* Increased text size and padding */}
                </ul>
                {/* Select & Continue button - larger padding */}
                <button
                  onClick={() => handleSelectAndProceed(flight)}
                  className="mt-5 w-full bg-white hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-md transition duration-150"
                >
                  Select & Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Round-Trip Flight ---
  if (flightType === 'round-trip') {
    const outboundSegmentData = {
      ...commonFlightData,
      departureTime: flight.OutboundDepartureTime,
      arrivalTime: flight.OutboundArrivalTime,
      departureAirportName: flight.OutboundAirportName,
      arrivalAirportName: flight.ArrivalAirportName, // Destination
      departureCity: flight.OutboundCity,
      arrivalCity: flight.ArrivalCity,
      outboundPrice: flight.OutboundPrice,
      flightNumber: flight.OutboundFlightNumber,
      availableSeats: flight.AvailableOutboundSeats,
      duration: calculateDuration(flight.OutboundDepartureTime, flight.OutboundArrivalTime),
      connections: flight.OutboundConnections || 0,
      layoverInfo: flight.OutboundLayoverInfo || (flight.OutboundConnections > 0 ? "Details unavailable" : "Direct flight"),
      aircraftType: flight.OutboundAircraftType || commonFlightData.aircraftType,
      isDetailsDropdownOpen: detailsOpenOutbound,
      toggleDetailsDropdown: () => setDetailsOpenOutbound(!detailsOpenOutbound),
    };

    const returnSegmentData = {
      ...commonFlightData,
      departureTime: flight.ReturnDepartureTime,
      arrivalTime: flight.ReturnArrivalTime,
      departureAirportName: flight.ArrivalAirportName, // Return from Destination
      arrivalAirportName: flight.OutboundAirportName, // Return to Origin
      departureCity: flight.ArrivalCity, // Return from
      arrivalCity: flight.OutboundCity, // Return to
      flightNumber: flight.ReturnFlightNumber,
      returnPrice : flight.ReturnPrice,
      availableSeats: flight.AvailableReturnFlightSeats,
      duration: calculateDuration(flight.ReturnDepartureTime, flight.ReturnArrivalTime),
      connections: flight.ReturnConnections || 0,
      layoverInfo: flight.ReturnLayoverInfo || (flight.ReturnConnections > 0 ? "Details unavailable" : "Direct flight"),
      aircraftType: flight.ReturnAircraftType || commonFlightData.aircraftType,
      isDetailsDropdownOpen: detailsOpenReturn,
      toggleDetailsDropdown: () => setDetailsOpenReturn(!detailsOpenReturn),
    };
    const isSoldOut = flight.AvailableOutboundSeats <= 0 || flight.AvailableReturnFlightSeats <= 0;

    return (
      // Card container - dark background, subtle border, subtle shadow on hover, increased padding
      <div className="mb-8 rounded-lg border border-zinc-700 bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-300"> {/* Increased bottom margin */}
        <div className="p-6"> {/* Increased padding */}
          {renderFlightSegmentUI(outboundSegmentData, 'outbound')}
          <hr className="my-5 border-zinc-700" /> {/* Increased vertical margin */}
          {renderFlightSegmentUI(returnSegmentData, 'return')}
        </div>
        {/* Price and Booking Action Bar - slightly different dark background, increased padding */}
        <div className="bg-zinc-800 px-6 py-4 border-t border-zinc-700 flex flex-col sm:flex-row items-center justify-between"> {/* Increased padding */}
          <div className="mb-3 sm:mb-0"> {/* Increased bottom margin */}
            {/* Class text - slightly larger muted gray */}
            <p className="text-sm text-gray-500">{flightClassDisplayName} class</p> {/* Increased text size */}
            {/* Price text - larger desaturated gold/green */}
            <p className="text-2xl font-bold text-white"> {/* Increased text size */}
              Total EUR {flight.Price?.toFixed(2)}
            </p>
          </div>
          <div className="relative text-black"> {/* Removed stray 'text-black' here */}
            {/* Book Button - Larger padding, Plane icon inside made white */}
            <button
              onClick={() => !isSoldOut && setBookingInfoOpen(!bookingInfoOpen)}
              disabled={isSoldOut}
              // Button styled white with black text as per your provided snippet
              className={`bg-white text-black font-semibold py-3 px-6 rounded-md shadow-sm hover:bg-gray-300 transition duration-150 ease-in-out flex items-center ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* IconPlaneTakeoff is rendered here */}
               <IconPlaneTakeoff /> {/* Note: IconPlaneTakeoff is set to text-white, which will be invisible on a white button */}
              {isSoldOut ? "Sold Out" : "Book Flight"}
            </button>
             {/* Booking Info Popup - dark background, increased padding, now appears below */}
            {bookingInfoOpen && !isSoldOut && (
              // Positioning changed from bottom-full + mb-3 to top-full + mt-3
              <div className="absolute right-0 top-full mt-3 w-80 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl p-5 z-20 animate-fadeInUp"> {/* Increased width, top margin, and padding */}
                {/* Close Button */}
                <button
                    onClick={() => setBookingInfoOpen(false)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-zinc-700 transition-colors duration-200"
                    aria-label="Close"
                >
                    <IconClose />
                </button>

                {/* Popup header - slightly larger muted gray */}
                <h5 className="text-lg font-semibold text-gray-200 mb-4 flex items-center"><IconInfo />Fare Information</h5> {/* Increased text size and margin */}
                {/* Popup text - slightly larger muted gray */}
                <ul className="text-base text-gray-400 space-y-3"> {/* Increased text size and spacing */}
                  <li className="flex items-start"><IconLuggage /><span className="ml-1">Baggage: {flight.BaggageAllowance?.Checked || "1pc, 23kg (standard)"}</span></li>
                  {/* Added fake info */}
                  <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m0 0 3.181 3.181Nm0-7.424-3.181 3.181m0 0-3.181-3.181m3.181 3.181L15.04 9.348m6.613 1.328c1.11.336 2.211.668 3.291.992M3.49 19.602l-.742 2.228ª9.185 9.185 0 0 0 6.405.998H9.72m.06-1.506.329-.892M13.672 13.01a.995.995 0 0 1 1.393-.11C16.002 13.417 17 14.47 17 15.75c0 .81-.338 1.58-.93 2.14L12 20.25v-4.72m4.26-4.26H10.5" />
                      </svg>
                      <span className="ml-1">Changes: Fees apply ({flightType === 'one-way' ? 'non-refundable' : 'rebooking fee'})</span>
                  </li>
                   <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-.698m-.E2 1.838A23.858 23.858 0 0 1 12 20.522 23.848 23.848 0 0 1 3.373 17.082m16.E2 1.838c-.32-.308-.651-.608-.992-.902M3.373 17.082a23.848 23.848 0 0 0 5.454-.698m-.E2 1.838A23.858 23.858 0 0 1 12 20.522 23.848 23.848 0 0 1 3.373 17.082" />
                      </svg>
                      <span className="ml-1">Frequent Flyer: Accrue miles (specific to airline program)</span>
                   </li>
                   <li className="flex items-start">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm4 14a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" />
                      </svg>
                      <span className="ml-1">Seat Selection: Available for a fee</span>
                   </li>
                   <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-gray-500">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                       </svg>
                       <span className="ml-1">Check-in: Opens 48 hours before departure</span>
                   </li>
                   <li className="flex items-start">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                       </svg>
                       <span className="ml-1">Refunds: Subject to fare rules</span>
                   </li>
                  {/* End of added fake info */}
                  <li className="text-sm text-gray-500 pt-2">Full conditions apply. Seat selection may be extra.</li> {/* Increased text size and padding */}
                </ul>
                {/* Select & Continue button - larger padding */}
                <button
                  onClick={() => handleSelectAndProceed(flight)}
                  className="mt-5 w-full bg-white hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-md transition duration-150"
                >
                  Select & Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default FlightCard;