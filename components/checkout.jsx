"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/utilis/auth";
import Loader from "@/components/loader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CheckoutForm() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [flightData, setFlightData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [flightType, setFlightType] = useState("");
  const [flightClass, setFlightClass] = useState("");
  const [userID, setUserId] = useState(0);
  const [seatIDOutbound, setSeatIDOutbound] = useState(0);
  const [seatIDReturn, setSeatIDReturn] = useState(0);
  const [priceOutbound, setPriceOutbound] = useState(0);
  const [priceReturn, setPriceReturn] = useState(0);
  const [outboundDate, setOutboundDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [flightIDOutbound, setFlightIDOutbound] = useState(0);
  const [flightIDReturn, setFlightIDReturn] = useState(0);

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

  const tax = 30;
  const serviceFee = 15;

  useEffect(() => {
    const storedFlightDetails = localStorage.getItem("selectedFlight");
    const returnSeat = localStorage.getItem("selectedReturnSeat");
    const outboundSeat = localStorage.getItem("selectedOutboundSeat");
    const flightTypeLoad = localStorage.getItem("type");
    const userLoad = localStorage.getItem("user");

    if (userLoad) {
      const parsed = JSON.parse(userLoad);
      setUserId(parsed["UserID"]);
    }
    if (returnSeat) {
      const parsed = JSON.parse(returnSeat);
      setSeatIDReturn(parsed["seatID"]);
    }
    if (outboundSeat) {
      const parsed = JSON.parse(outboundSeat);
      setSeatIDOutbound(parsed["seatID"]);
      setFlightClass(parsed["className"]);
    } else {
      window.location.href = "/";
    }
    if (flightTypeLoad) {
      setFlightType(flightTypeLoad);
      if (flightTypeLoad == "round-trip") {
        const parsed = JSON.parse(storedFlightDetails);
        setFlightData(parsed);
        setPriceOutbound(parsed["OutboundPrice"] + tax + serviceFee);

        setPriceReturn(parsed["ReturnPrice"] + tax + serviceFee);
        setOutboundDate(parsed["OutboundDepartureTime"]);
        setReturnDate(parsed["ReturnDepartureTime"]);
        setFlightIDOutbound(parsed["OutboundFlightID"]);
        setFlightIDReturn(parsed["ReturnFlightID"]);
      } else if (flightTypeLoad == "one-way") {
        const parsed = JSON.parse(storedFlightDetails);
        setFlightData(parsed);
        setPriceOutbound(parsed["Price"] + tax + serviceFee);
        setOutboundDate(parsed["DepartureTime"]);
        setFlightIDOutbound(parsed["flightId"]);
      } else {
        window.location.href = "/";
      }
    } else {
      window.location.href = "/";
    }
  }, []);

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.warn("Please select a payment method.");
      return;
    }
    if (!cardNumber || !expiry || !cvv) {
      toast.warn("Please enter your card details.");
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      if (flightType == "one-way") {
        const response = await fetch(
          "http://localhost:8080/api/seats/bookSeat",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              UserID: userID,
              flightID: flightIDOutbound,
              SeatID: seatIDOutbound,
              flightClass: flightClass,
              Amount: priceOutbound,
              DepartureDate: outboundDate,
            }),
          }
        );

        if (!response.ok) {
          const err = await response.json();
          toast.error("Failed to book seat.");
          return;
        }
        router.push(`/finalTicket`);
        toast.success("Payment successful and seat booked!");
      } else if (flightType == "round-trip") {
        const response = await fetch(
          "http://localhost:8080/api/seats/bookSeatRoundTrip",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              flightIDReturn: flightIDReturn,
              flightIDOutbound: flightIDOutbound,
              flightClass: flightClass,
              SeatIDReturn: seatIDReturn,
              SeatIDOutbound: seatIDOutbound,
              UserID: userID,
              AmountOutbound: priceOutbound,
              AmountReturn: priceReturn,
              DepartureDate: outboundDate,
              ReturnDate: returnDate,
            }),
          }
        );

        if (!response.ok) {
          const err = await response.json();
          toast.error("Failed to book seats.");
          return;
        }
        router.push(`/finalTicket`);
        toast.success("Payment successful and seats booked!");
      } else {
        toast.error("Error booking flight please try again");
      }
    } catch (err) {
      toast.error("Failed to book seat. Please try again.");
      setError(err.message || "An error occurred during booking.");
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentOptions = [
    { name: "Visa", image: "/visa.jpg" },
    { name: "MasterCard", image: "/master.png" },
    { name: "PayPal", image: "/paypal.png" },
    { name: "JazzCash", image: "/jazz.png" },
    { name: "EasyPaisa", image: "/easypaisa.png" },
    { name: "Apple Pay", image: "/applepay.png" },
  ];

  const total = flightData?.Price
    ? parseFloat(flightData.Price) + tax + serviceFee
    : 0;

  if (!authChecked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 my-15 bg-zinc-900 text-white">
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
      <h1 className="text-3xl font-extralight text-center mb-6">
        Confirm Payment
      </h1>

      {flightData ? (
        <div className="p-6 rounded-lg shadow-md space-y-6">
          <div>
            <h2 className="text-xl font-extralight mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {paymentOptions.map((option) => (
                <div
                  key={option.name}
                  onClick={() => setPaymentMethod(option.name)}
                  className={`border border-2 rounded-lg p-3 bg-white flex items-center justify-center cursor-pointer transition ${
                    paymentMethod === option.name
                      ? "ring-3 ring-red-400 border-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Image
                    src={option.image}
                    alt={option.name}
                    width={90}
                    height={90}
                  />
                </div>
              ))}
            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>

          {/* Card Details Input */}
          <div>
            <h2 className="text-xl font-extralight mb-4">Card Details</h2>
            <Input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="mb-3 text-white bg-gray-200"
            />
            <div className="grid grid-cols-2 gap-4 mb-3">
              <Input
                type="text"
                placeholder="Expiry (MM/YY)"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="mb-3 text-white bg-gray-200"
              />
              <Input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="mb-3 text-white bg-gray-200"
              />
            </div>
          </div>

          {/* Fare Summary */}
          <div className="bg-zinc-800 p-4 rounded">
            <div className="flex justify-between mb-2">
              <span>Base Fare:</span>
              <span>${flightData.Price}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax:</span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Service Fee:</span>
              <span>${serviceFee}</span>
            </div>
            <div className="flex justify-between font-extralight text-lg">
              <span>Total:</span>
              <span>${total}</span>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`bg-gray-800 text-white px-6 py-6 rounded-lg mt-6 font-light hover:bg-gray-900 transition w-full text-xl ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? "Processing Payment..." : "Pay & Book Seat"}
            </Button>
            {isProcessing && (
              <div className="mt-4 text-center animate-pulse text-gray-500">
                <p>⏳ Please wait, booking your seat...</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500">
          No flight data found in local storage.
        </p>
      )}
    </div>
  );
}