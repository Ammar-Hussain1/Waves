"use client"; // Ensure this is a client-side component

import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import {
  Airplay,
  User,
  Ticket,
  CheckCircle,
  Calendar,
  Clock,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../utilis/auth";
import Loader from "@/components/loader";
import MealAndPassPage from "../mealandpass/page";

// Function to format time (unchanged)
const formatTime = (time) => {
  try {
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "N/A";
  }
};

// Function to format date (unchanged)
const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "N/A";
  }
};

// Function to calculate flight duration (unchanged)
const calculateDuration = (departureTime, arrivalTime) => {
  try {
    const diffInMs =
      new Date(arrivalTime).getTime() - new Date(departureTime).getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(
      (diffInMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    return `${diffInHours}h ${diffInMinutes}m`;
  } catch (error) {
    return "N/A";
  }
};

const ETicket = () => {
  const [flightData, setFlightData] = useState(null);
  const [passengerData, setPassengerData] = useState(null);
  const [mealData, setMealData] = useState(null);
  const [flightClass, setFlightClass] = useState(""); // Note: flightClass is loaded but not used in the UI/PDF
  const [flightType, setFlightType] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  const router = useRouter();
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
  }, [user, loading, router, pathname]);

  useEffect(() => {
    const storedFlight = localStorage.getItem("selectedFlight");
    const storedPassengers = localStorage.getItem("passengerInfo");
    const storedMealSelections = localStorage.getItem("mealSelections");
    const storedClass = localStorage.getItem("class");
    const storedType = localStorage.getItem("type");
    console.log(storedMealSelections);

    if (storedFlight) {
      setFlightData(JSON.parse(storedFlight));
    } else {
      window.location.href = "/";
    }
    if (storedPassengers) {
      setPassengerData(JSON.parse(storedPassengers));
    } else {
      window.location.href = "/";
    }
    if (storedMealSelections) {
      setMealData(JSON.parse(storedMealSelections));
    } else {
      window.location.href = "/";
    }
    if (storedClass) {
      setFlightClass(storedClass);
    } else {
      window.location.href = "/";
    }
    if (storedType) {
      setFlightType(storedType);
    } else {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    // Set total price from flight data if available and not already set
    if (flightData && flightData.Price && !totalPrice) {
      // Assuming Price might be a number or string like "123.45"
      const priceValue =
        typeof flightData.Price === "string"
          ? parseFloat(flightData.Price.replace(/[^0-9.]/g, "")) // Extract number
          : flightData.Price;

      if (!isNaN(priceValue)) {
        setTotalPrice(priceValue.toFixed(2)); // Format to 2 decimal places
      } else {
        setTotalPrice("N/A"); // Handle case where price is invalid
      }
    }
  }, [flightData, totalPrice]);

  // Generate the flight details based on flight type (logic unchanged)
  const getFlightDetails = () => {
    if (!flightData) return []; // Handle case where flightData is not loaded yet

    if (flightType === "one-way") {
      return [
        {
          segmentType: "outbound",
          departureTime: formatTime(flightData.DepartureTime),
          departureDate: formatDate(flightData.DepartureTime),
          originCityName: flightData.DepartureCity || "N/A",
          originAirportName: flightData.DepartureAirportName || "N/A",
          arrivalTime: formatTime(flightData.ArrivalTime),
          arrivalDate: formatDate(flightData.ArrivalTime),
          destinationCityName: flightData.ArrivalCity || "N/A",
          destinationAirportName: flightData.ArrivalAirportName || "N/A",
          duration: calculateDuration(
            flightData.DepartureTime,
            flightData.ArrivalTime
          ),
          flightNumber: flightData.flightNumber || "N/A",
          airlineName: "WAVES",
          airlineCode: "WV",
          aircraftType: "Boeing 777",
          isDirect: true,
        },
      ];
    } else if (flightType === "round-trip") {
      const outboundSegment = {
        segmentType: "outbound",
        departureTime: formatTime(flightData.OutboundDepartureTime),
        departureDate: formatDate(flightData.OutboundDepartureTime),
        originCityName: flightData.OutboundCity || "N/A",
        originAirportName: flightData.OutboundAirportName || "N/A",
        arrivalTime: formatTime(flightData.OutboundArrivalTime),
        arrivalDate: formatDate(flightData.OutboundArrivalTime),
        destinationCityName: flightData.ArrivalCity || "N/A",
        destinationAirportName: flightData.ArrivalAirportName || "N/A",
        duration: calculateDuration(
          flightData.OutboundDepartureTime,
          flightData.OutboundArrivalTime
        ),
        flightNumber: flightData.OutboundFlightNumber || "N/A",
        airlineName: "SadaFly",
        airlineCode: "SF",
        aircraftType: "Boeing 777",
        isDirect: true,
      };

      const returnSegment = {
        segmentType: "return",
        departureTime: formatTime(flightData.ReturnDepartureTime),
        departureDate: formatDate(flightData.ReturnDepartureTime),
        originCityName: flightData.ArrivalCity || "N/A",
        originAirportName: flightData.ArrivalAirportName || "N/A",
        arrivalTime: formatTime(flightData.ReturnArrivalTime),
        arrivalDate: formatDate(flightData.ReturnArrivalTime),
        destinationCityName: flightData.OutboundCity || "N/A",
        destinationAirportName: flightData.OutboundAirportName || "N/A",
        duration: calculateDuration(
          flightData.ReturnDepartureTime,
          flightData.ReturnArrivalTime
        ),
        flightNumber: flightData.ReturnFlightNumber || "N/A",
        airlineName: "SadaFly",
        airlineCode: "SF",
        aircraftType: "Boeing 777",
        isDirect: true,
      };
      return [outboundSegment, returnSegment];
    }
    return [];
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const headerColor = "#003366"; // Dark Blue
    const accentColor = "#4CAF50"; // Green (or could use a teal like #0D9488)
    const primaryTextColor = "#333333"; // Dark Gray
    const secondaryTextColor = "#555555"; // Medium Gray
    const priceColor = "#D43F3D"; // Red
    const footerColor = "#888888"; // Light Gray

    doc.setFontSize(24);
    doc.setTextColor(headerColor);
    doc.text("E-TICKET", 105, 20, { align: "center" });

    // Airline Logo Placeholder
    doc.setFontSize(16);
    doc.setTextColor(accentColor);
    doc.text("WAVES", 105, 30, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(primaryTextColor);

    // Flight Information
    const flightDetails = getFlightDetails();
    let startY = 50; // Initial Y position

    if (!flightDetails || flightDetails.length === 0) {
      doc.text("Flight information not available.", 10, startY);
      startY += 10;
    } else {
      flightDetails.forEach((segment, index) => {
        doc.setFontSize(14);
        doc.setTextColor(headerColor);
        doc.text(
          `Flight ${index + 1} - ${segment.segmentType.toUpperCase()} FLIGHT`,
          10,
          startY
        );
        doc.setFontSize(12);
        doc.setTextColor(secondaryTextColor);

        startY += 10;
        doc.text(
          `Airline: ${segment.airlineName} (${segment.airlineCode})`,
          10,
          startY
        );
        startY += 7;
        doc.text(`Flight Number: ${segment.flightNumber}`, 10, startY);
        startY += 7;
        doc.text(`Aircraft: ${segment.aircraftType}`, 10, startY);
        startY += 7;
        doc.text(
          `From: ${segment.originCityName} (${segment.originAirportName})`,
          10,
          startY
        );
        startY += 7;
        doc.text(
          `To: ${segment.destinationCityName} (${segment.destinationAirportName})`,
          10,
          startY
        );
        startY += 7;
        doc.text(
          `Departure: ${segment.departureDate}, ${segment.departureTime}`,
          10,
          startY
        );
        startY += 7;
        doc.text(
          `Arrival: ${segment.arrivalDate}, ${segment.arrivalTime}`,
          10,
          startY
        );
        startY += 7;
        doc.text(`Duration: ${segment.duration}`, 10, startY);
        startY += 15; // Add space before next flight or section
      });
    }

    // Passenger Information
    // Passenger Info Section
    doc.setFontSize(14);
    doc.setTextColor(headerColor);
    doc.text("Passenger Information", 10, startY);
    doc.setFontSize(12);
    doc.setTextColor(secondaryTextColor);

    // Displaying passenger info
    if (passengerData && passengerData.length > 0) {
      // Loop through passenger data if there are multiple passengers
      passengerData.forEach((passenger, index) => {
        startY += 10 + index * 30; // Adjust the startY for each passenger (if needed)

        doc.text(`Passenger #${index + 1}: ${passenger.fullName}`, 10, startY);
        startY += 7;
        doc.text(`Email: ${passenger.contact.email}`, 10, startY);
        startY += 7;
        doc.text(`Phone: ${passenger.contact.cellNumber}`, 10, startY);
        startY += 7;
        doc.text(
          `Address: ${passenger.contact.houseNumber}, ${passenger.contact.street}, ${passenger.contact.city}`,
          10,
          startY
        );
        startY += 7;
        doc.text(`Country: ${passenger.contact.country}`, 10, startY);
        startY += 10;
      });
    } else {
      doc.text("Passenger information not available.", 10, startY + 10);
    }

    // Meal Selections
    if (mealData && mealData.length > 0) {
      startY += 10; // Space before Meal section
      doc.setFontSize(14);
      doc.setTextColor(headerColor);
      doc.text("Meal Selections", 10, startY);
      doc.setFontSize(12);
      doc.setTextColor(secondaryTextColor);
      startY += 10;

      mealData.forEach((meal, index) => {
        doc.text(
          `${index + 1}. ${meal.lunch || "No selection"}`,
          10,
          startY + index * 7
        );
      });

      startY += mealData.length * 7; 
    } else {
      startY += 5;
    }

    // Price Details
    startY += 10; // Space before Price section
    doc.setFontSize(14);
    doc.setTextColor(headerColor);
    // Use text width calculation for better alignment if price varies
    const priceLabel = "Total Price:";
    const priceValueText = `${totalPrice || "N/A"} EUR`;
    const priceLabelWidth = doc.getTextWidth(priceLabel);
    doc.text(priceLabel, 10, startY);

    doc.setFontSize(12);
    doc.setTextColor(priceColor); // Use specific price color
    doc.text(priceValueText, 10 + priceLabelWidth + 5, startY); // Position value after label

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(footerColor);
    doc.text("Thank you for choosing WAVES. Safe travels!", 10, 290); // Position near bottom

    doc.save("e-ticket-Waves.pdf");
  };

  // Loading state or check if data is ready
  if (!flightData || !passengerData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 text-gray-300">
        Loading E-Ticket...
      </div>
    );
  }

  return (
    // --- Dark Theme UI ---
    <div className="min-h-screen bg-zinc-950  flex items-center justify-center p-4 font-sans">
      <div className="bg-zinc-900 rounded-xl shadow-lg w-full max-w-2xl p-6 md:p-8 space-y-8">
        {" "}
        {/* Added md:p-8 */}
        <h2 className="text-3xl font-extralight text-gray-100 text-center flex items-center justify-center gap-2">
          <Ticket className="w-7 h-7 text-gray-300" />{" "}
          {/* Adjusted size and color */}
          Your E-Ticket
        </h2>
        {/* Flight Info Section */}
        <div className="bg-zinc-800 rounded-lg p-6 space-y-6">
          {" "}
          {/* Increased spacing */}
          <h3 className="text-xl font-extralight text-gray-300 flex items-center gap-2 border-b border-gray-600 pb-2 mb-4">
            {" "}
            {/* Added border bottom */}
            <Airplay className="w-5 h-5" />
            Flight Information
          </h3>
          {getFlightDetails().map((segment, index) => (
            <div
              key={index}
              className="border-l-4 border-gray-800 pl-4 space-y-3"
            >
              {" "}
              {/* Increased spacing */}
              <h4 className="text-lg font-medium text-gray-100">
                {segment.segmentType.toUpperCase()} Flight
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-gray-300 text-sm">
                {" "}
                {/* Responsive columns & smaller text */}
                <div>
                  <p>
                    <span className="font-extralight text-gray-200">
                      Airline:
                    </span>{" "}
                    {segment.airlineName} ({segment.airlineCode})
                  </p>
                  <p>
                    <span className="font-extralight text-gray-200">
                      Flight No:
                    </span>{" "}
                    {segment.flightNumber}
                  </p>
                  <p>
                    <span className="font-extralight text-gray-200">
                      Aircraft:
                    </span>{" "}
                    {segment.aircraftType}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-extralight text-gray-200">From:</span>{" "}
                    {segment.originCityName} ({segment.originAirportName})
                  </p>
                  <p>
                    <span className="font-extralight text-gray-200">To:</span>{" "}
                    {segment.destinationCityName} (
                    {segment.destinationAirportName})
                  </p>
                </div>
                <div className="md:col-span-2">
                  {" "}
                  {/* Span full width on medium screens */}
                  <p className="flex items-center">
                    <span className="font-extralight text-gray-200 w-20">
                      Departure:
                    </span>{" "}
                    <Calendar className="inline-block w-4 h-4 mr-1.5 text-gray-300" />
                    {segment.departureDate},{" "}
                    <Clock className="inline-block w-4 h-4 ml-3 mr-1.5 text-gray-300" />
                    {segment.departureTime}
                  </p>
                  <p className="flex items-center">
                    <span className="font-extralight text-gray-200 w-20">
                      Arrival:
                    </span>{" "}
                    <Calendar className="inline-block w-4 h-4 mr-1.5 text-gray-300" />
                    {segment.arrivalDate},{" "}
                    <Clock className="inline-block w-4 h-4 ml-3 mr-1.5 text-gray-300" />
                    {segment.arrivalTime}
                  </p>
                  <p>
                    <span className="font-extralight text-gray-200">
                      Duration:
                    </span>{" "}
                    {segment.duration}
                  </p>
                </div>
              </div>
              {/* Add a divider if there's a next segment */}
              {index < getFlightDetails().length - 1 && (
                <hr className="border-gray-600 my-4" />
              )}
            </div>
          ))}
        </div>
        {/* Passenger Info Section */}
        <div className="bg-zinc-800 rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-extralight text-gray-300 flex items-center gap-2 border-b border-gray-600 pb-2 mb-4">
            <User className="w-5 h-5" />
            Passenger Information
          </h3>
          {/* Displaying passenger info */}
          {passengerData ? (
            <div className="text-gray-300 text-sm">
              <p>
                <span className="font-extralight text-gray-200">Name:</span>{" "}
                {passengerData[0].fullName}
              </p>
              <p>
                <span className="font-extralight text-gray-200">Email:</span>{" "}
                {passengerData[0].contact.email}
              </p>
              <p>
                <span className="font-extralight text-gray-200">
                  Phone Number:
                </span>{" "}
                {passengerData[0].contact.cellNumber}
              </p>
              <p>
                <span className="font-extralight text-gray-200">Address:</span>{" "}
                {`${passengerData[0].contact.houseNumber}, ${passengerData[0].contact.street}, ${passengerData[0].contact.city}`}
              </p>
              <p>
                <span className="font-extralight text-gray-200">Country:</span>{" "}
                {passengerData[0].contact.country}
              </p>
            </div>
          ) : (
            <p>Passenger information not available.</p>
          )}
        </div>
        {/* Meal Selections Section (Conditional) */}
        {mealData && mealData.length > 0 && (
          <div className="bg-zinc-800 rounded-lg p-6 space-y-6">
            <h3 className="text-xl font-extralight text-gray-300 flex items-center gap-2 border-b border-gray-600 pb-2 mb-4">
              <Airplay className="w-5 h-5" />
              Meal Selections
            </h3>
            <div className="text-gray-300 text-sm">
              {mealData && mealData.length > 0 ? (
                mealData.map((meal, index) => (
                  <p key={index}>
                    <span className="font-extralight text-gray-200">
                      Meal {index + 1}:
                    </span>{" "}
                    {meal.lunch || "No selection"}
                  </p>
                ))
              ) : (
                <p>No meal selections made.</p>
              )}
            </div>
          </div>
        )}
        {/* Total Price Section */}
        <div className="bg-zinc-800 rounded-lg p-6 text-center">
          {" "}
          {/* Centered price */}
          <h3 className="text-lg font-extralight text-gray-300 mb-2">
            Total Price
          </h3>{" "}
          {/* Smaller title */}
          <p className="text-3xl font-extrabold text-white">
            {totalPrice ? `${totalPrice} EUR` : "N/A"}
          </p>{" "}
          {/* Adjusted size and added currency */}
        </div>
        {/* Download Button */}
        <button
          onClick={generatePDF}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-extralight py-3 px-6 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 focus:ring-offset-gray-800" // Added focus states
        >
          Download E-Ticket (PDF)
        </button>
      </div>
    </div>
  );
};

export default ETicket;
