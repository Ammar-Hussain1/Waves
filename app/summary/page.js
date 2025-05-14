"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import SlidingHeader from "@/components/slider";
import { useAuth } from "../utilis/auth";
import Loader from "@/components/loader";

// Helper function to format date string to "Month Day, Year"
const formatDate = (dateTimeString) => {
  if (!dateTimeString) return "N/A";
  try {
    const date = new Date(dateTimeString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    return dateTimeString; // Fallback
  }
};

// Helper function to format date string to "HH:MM AM/PM" or "HH:MM" (24h if no locale)
const formatTime = (dateTimeString) => {
  if (!dateTimeString) return "N/A";
  try {
    const date = new Date(dateTimeString);
    // Attempt to use locale-specific time, fallback to basic hours/minutes
    return date
      .toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
      .replace(/:\d{2}\s/, " "); // Basic formatting
  } catch (e) {
    const date = new Date(dateTimeString); // try again if error
    if (date.getHours && date.getMinutes) {
      return `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`;
    }
    return "Invalid Time";
  }
};

// Helper function to calculate duration
const calculateDuration = (startDateTimeString, endDateTimeString) => {
  if (!startDateTimeString || !endDateTimeString) return "N/A";
  try {
    const startDate = new Date(startDateTimeString);
    const endDate = new Date(endDateTimeString);
    const diffMs = endDate - startDate;
    if (isNaN(diffMs) || diffMs < 0) return "N/A";

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  } catch (e) {
    return "N/A";
  }
};

const FlightSummary = () => {
  const router = useRouter();
  const [flightData, setFlightData] = useState(null);
  const [passengerData, setPassengerData] = useState([]);
  const [mealData, setMealData] = useState([]);
  const [flightClass, setFlightClass] = useState("");
  const [flightType, setFlightType] = useState(""); // 'one-way' or 'round-trip'
  const [totalPrice, setTotalPrice] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  const pathname = usePathname();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/signup?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setAuthChecked(true);
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    const storedFlight = localStorage.getItem("selectedFlight");
    const storedPassengers = localStorage.getItem("passengerInfo");
    const storedMealSelections = localStorage.getItem("mealSelections");
    const storedClass = localStorage.getItem("class"); // This is expected to be 'Economy', 'Business', etc.
    const storedType = localStorage.getItem("type"); // 'one-way' or 'round-trip'
    const storedTotalPrice = localStorage.getItem("totalPrice");

    if (
      !storedFlight ||
      !storedPassengers ||
      !storedMealSelections ||
      !storedClass ||
      !storedType
    ) {
      window.location.href = "/";
    }

    if (storedFlight) setFlightData(JSON.parse(storedFlight));
    if (storedPassengers) setPassengerData(JSON.parse(storedPassengers));
    if (storedMealSelections) setMealData(JSON.parse(storedMealSelections));
    if (storedClass) setFlightClass(storedClass);
    if (storedType) setFlightType(storedType);

    if (storedTotalPrice) {
      setTotalPrice(storedTotalPrice);
    }
  }, []);

  useEffect(() => {
    if (flightData && flightData.Price && !totalPrice) {
      // Ensure Price is formatted consistently, e.g., with currency
      // For now, directly using flightData.Price. Add currency formatting if needed.
      setTotalPrice(
        typeof flightData.Price === "number"
          ? `$${flightData.Price.toFixed(2)}`
          : flightData.Price
      );
    }
    // For debugging:
    // console.log("Flight Type Loaded:", flightType);
    // console.log("Selected Flight Data:", flightData);
    // console.log("Flight Class:", flightClass);
    // console.log("Total Price:", totalPrice);
  }, [flightData, flightType, flightClass, totalPrice, passengerData]);

  const handleProceedToPayment = () => {
    router.push("/checkout");
  };

  const getFlightSegments = () => {
    if (!flightData || !flightType) return [];

    if (flightType === "one-way") {
      // API fields: DepartureTime, ArrivalTime, DepartureCity, DepartureAirportName, ArrivalCity, ArrivalAirportName, flightNumber, Price
      return [
        {
          segmentType: "outbound",
          departureTime: formatTime(flightData.DepartureTime),
          departureDate: formatDate(flightData.DepartureTime),
          originCityName: flightData.DepartureCity || "N/A",
          originAirportName: flightData.DepartureAirportName || "N/A", // Using full name as code
          arrivalTime: formatTime(flightData.ArrivalTime),
          arrivalDate: formatDate(flightData.ArrivalTime),
          destinationCityName: flightData.ArrivalCity || "N/A",
          destinationAirportName: flightData.ArrivalAirportName || "N/A", // Using full name
          duration: calculateDuration(
            flightData.DepartureTime,
            flightData.ArrivalTime
          ),
          flightNumber: flightData.flightNumber || "N/A",
          airlineName: flightData.airlineName || "N/A", // Not in API
          airlineCode: flightData.airlineCode || "", // Not in API
          aircraftType: flightData.aircraftType || "N/A", // Not in API
          isDirect: true, // Assumed for one-way from this API structure
        },
      ];
    } else if (flightType === "round-trip") {
      // API fields: OutboundDepartureTime, OutboundArrivalTime, OutboundCity, OutboundAirportName,
      //             ArrivalCity (dest of outbound), ArrivalAirportName (dest of outbound)
      //             ReturnDepartureTime, ReturnArrivalTime, ReturnFlightNumber
      //             Price (total)
      const outboundSegment = {
        segmentType: "outbound",
        departureTime: formatTime(flightData.OutboundDepartureTime),
        departureDate: formatDate(flightData.OutboundDepartureTime),
        originCityName: flightData.OutboundCity || "N/A",
        originAirportName: flightData.OutboundAirportName || "N/A",
        arrivalTime: formatTime(flightData.OutboundArrivalTime),
        arrivalDate: formatDate(flightData.OutboundArrivalTime),
        destinationCityName: flightData.ArrivalCity || "N/A", // Destination of the outbound leg
        destinationAirportName: flightData.ArrivalAirportName || "N/A",
        duration: calculateDuration(
          flightData.OutboundDepartureTime,
          flightData.OutboundArrivalTime
        ),
        flightNumber: flightData.OutboundFlightNumber || "N/A",
        airlineName: flightData.outboundAirlineName || "N/A", // Not in API
        airlineCode: flightData.outboundAirlineCode || "", // Not in API
        aircraftType: flightData.outboundAircraftType || "N/A", // Not in API
        isDirect: true, // Assumed
      };

      const returnSegment = {
        segmentType: "return",
        departureTime: formatTime(flightData.ReturnDepartureTime),
        departureDate: formatDate(flightData.ReturnDepartureTime),
        originCityName: flightData.ArrivalCity || "N/A", // Origin of the return leg is destination of outbound
        originAirportName: flightData.ArrivalAirportName || "N/A",
        arrivalTime: formatTime(flightData.ReturnArrivalTime),
        arrivalDate: formatDate(flightData.ReturnArrivalTime),
        destinationCityName: flightData.OutboundCity || "N/A", // Destination of return is origin of outbound
        destinationAirportName: flightData.OutboundAirportName || "N/A",
        duration: calculateDuration(
          flightData.ReturnDepartureTime,
          flightData.ReturnArrivalTime
        ),
        flightNumber: flightData.ReturnFlightNumber || "N/A",
        airlineName: flightData.returnAirlineName || "N/A", // Not in API
        airlineCode: flightData.returnAirlineCode || "", // Not in API
        aircraftType: flightData.returnAircraftType || "N/A", // Not in API
        isDirect: true, // Assumed
      };
      return [outboundSegment, returnSegment];
    }
    return []; // Should not happen if flightType is one of these
  };

  const segments = getFlightSegments();

  // Loading state check
  if (
    !flightData ||
    passengerData.length === 0 ||
    !totalPrice ||
    !flightClass ||
    !flightType ||
    segments.length === 0
  ) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-100 p-10 ">
        <Card className="w-full max-w-3xl">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-extralight mb-4">
              Loading Your Trip Summary...
            </h1>
            <p className="text-white">
              Gathering your flight and passenger details.
            </p>
            <p className="mt-2 text-sm text-white">
              If this takes too long, please ensure you have completed all
              previous steps or try refreshing.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Determine overall trip origin and destination for the header
  let overallOriginCity = "N/A";
  let overallDestinationCity = "N/A";
  if (flightType === "one-way" && flightData) {
    overallOriginCity = flightData.DepartureCity || "N/A";
    overallDestinationCity = flightData.ArrivalCity || "N/A";
  } else if (flightType === "round-trip" && flightData) {
    overallOriginCity = flightData.OutboundCity || "N/A";
    overallDestinationCity = flightData.ArrivalCity || "N/A"; // Destination of the first leg
  }

  if (!authChecked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
        <Loader />
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 p-4 py-8 text-white">
      <SlidingHeader activeStep={"summary"} />
      <Card className="w-full max-w-3xl bg-zinc-800 shadow-xl rounded-lg my-10">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-extralight text-white">
              Your Trip Summary
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-white">
            {flightType === "one-way" ? "One-way trip" : "Round trip"} from{" "}
            {overallOriginCity} to {overallDestinationCity}
            {passengerData.length > 0 &&
              `, for ${passengerData.length} passenger${
                passengerData.length > 1 ? "s" : ""
              }`}
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 pb-4 border-b border-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extralight text-white">Itinerary</h2>
              <span className="text-xl font-extralight text-white">
                {totalPrice}
              </span>
            </div>

            <div className="border border-white rounded-lg p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-white mb-4 gap-2">
                <span className="font-extralight text-base text-white">
                  Flights
                </span>
                <a href="#" className="text-blue-400 hover:underline">
                  All flight details
                </a>
                <span className="text-xs sm:text-sm text-white sm:text-right">
                  Price per passenger - Inclusive of airfare, taxes, fees and
                  carrier-imposed charges.
                </span>
              </div>

              {segments.map((segment, idx) => (
                <div
                  key={idx}
                  className={`border-t border-white ${
                    idx === 0 ? "pt-0" : "pt-4 mt-4"
                  }`}
                >
                  {/* Section Title for Round Trip Legs */}
                  {flightType === "round-trip" && (
                    <h3 className="text-md font-extralight text-sky-700 mb-2 mt-1">
                      {segment.segmentType === "outbound"
                        ? "Outbound Flight"
                        : "Return Flight"}
                    </h3>
                  )}

                  <div className="mb-2">
                    <span className="font-extralight text-white">
                      {segment.departureDate}
                    </span>
                    {segment.airlineName !== "N/A" && (
                      <span className="ml-2 text-white">
                        ({segment.airlineName})
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-start">
                    <div className="text-left w-1/3">
                      <p className="text-xl sm:text-2xl font-extralight text-white">
                        {segment.departureTime}
                      </p>
                      <p
                        className="text-xs sm:text-sm font-extralight text-white truncate"
                        title={segment.originAirportName}
                      >
                        {segment.originAirportName}
                      </p>
                      <p className="text-xs text-white">
                        {segment.originCityName}
                      </p>
                    </div>

                    <div className="text-center flex-grow mx-2 sm:mx-4 pt-1 w-1/3">
                      <p className="text-xs sm:text-sm text-white">
                        {segment.duration}
                      </p>
                      <div className="w-full h-0.5 bg-white mt-1 mb-1 relative">
                        <div className="absolute left-0 top-1/2 w-2 h-2 bg-white rounded-full -translate-y-1/2"></div>
                        <div className="absolute right-0 top-1/2 w-2 h-2 bg-white rounded-full -translate-y-1/2"></div>
                      </div>
                      {segment.isDirect && (
                        <p className="text-xs text-white">Direct Flight</p>
                      )}
                    </div>

                    <div className="text-right w-1/3">
                      <p className="text-xl sm:text-2xl font-extralight text-white">
                        {segment.arrivalTime}
                      </p>
                      <p
                        className="text-xs sm:text-sm font-extralight text-white truncate"
                        title={segment.destinationAirportName}
                      >
                        {segment.destinationAirportName}
                      </p>
                      <p className="text-xs text-white">
                        {segment.destinationCityName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 text-xs sm:text-sm text-white">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 mr-1 text-white"
                        >
                          <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.13 9.25h6.116a.75.75 0 01.75.75v.006a.75.75 0 01-.75.75H5.13H5.13a1.5 1.5 0 00-1.435 1.086L2.279 16.76a.75.75 0 00.95.826l16-5.333a.75.75 0 000-1.418l-16-5.333z" />
                        </svg>
                        {segment.airlineCode}
                        {segment.flightNumber}
                      </span>
                      {segment.aircraftType !== "N/A" && (
                        <span>({segment.aircraftType})</span>
                      )}
                    </div>
                    {/* Display flight class only once, after the last segment details */}
                    {idx === segments.length - 1 && flightClass && (
                      <span className="font-extralight">{flightClass}</span>
                    )}
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-xs sm:text-sm mt-6 text-white border-t border-white pt-4">
                <div>
                  <p className="font-extralight">Checked baggage:</p>
                  <p>{flightData?.baggageAllowance || "Standard allowance"}</p>
                </div>
                <div>
                  <p className="font-extralight">Change fee:</p>
                  <p>{flightData?.changeFee || "As per fare rules"}</p>
                </div>
                <div>
                  <p className="font-extralight">Refund fee:</p>
                  <p>{flightData?.refundFee || "As per fare rules"}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="font-extralight">No-show penalty:</p>
                  <p>
                    {flightData?.noShowPenalty || "Refer to fare conditions"}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-blue-400 mt-6 space-y-1">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <a href="#" className="hover:underline">
                  Fare Breakdown
                </a>
                <a href="#" className="hover:underline">
                  View detailed fare conditions
                </a>
                <a href="#" className="hover:underline">
                  Terms & Conditions
                </a>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <a href="#" className="hover:underline">
                  Baggage allowance
                </a>
                <a href="#" className="hover:underline flex items-center">
                  Full baggage rules
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3 h-3 ml-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mb-6 pb-4 border-b border-white">
            <h2 className="text-xl font-extralight mb-4 text-white">Passengers</h2>
            <div className="space-y-3">
              {passengerData.map((passenger, index) => (
                <div
                  key={index}
                  className="border border-white rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row justify-between sm:items-center text-white"
                >
                  <div>
                    <p className="font-extralight text-sm sm:text-base">
                      {index + 1}. {passenger.title} {passenger.firstName}{" "}
                      {passenger.lastName}
                      <span className="ml-2 text-xs font-normal text-white">
                        ({passenger.type || "Adult"})
                      </span>
                    </p>
                    {mealData &&
                      mealData[index] &&
                      mealData[index].mealType &&
                      mealData[index].mealType !== "No selection" && (
                        <p className="text-xs sm:text-sm text-white mt-1">
                          Meal: {mealData[index].mealType}
                          {mealData[index].details &&
                          mealData[index].details !== "N/A"
                            ? ` (${mealData[index].details})`
                            : ""}
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 text-white">
            <h2 className="text-xl font-extralight">Total to be paid</h2>
            <span className="text-2xl font-extralight">{totalPrice}</span>
          </div>

          <Button
            onClick={handleProceedToPayment}
            className="w-full mt-8 bg-gray-400 hover:bg-gray-600 text-zinc-900 text-lg py-3 rounded-md"
          >
            Proceed to Payment
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default FlightSummary;
