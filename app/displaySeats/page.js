'use client';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import SlidingHeader from "@/components/slider";
import SeatMapDisplay from "@/components/seatmap";
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../utilis/auth';
import Loader from '@/components/loader';


const cn = (...classes) => classes.filter(Boolean).join(' ');
const SKELETON_SEAT_COUNT = 18;
const SEATS_PER_ROW = 6;

function SeatPicker() {
    const [flightInfo, setFlightInfo] = useState(null);
    const [flightClassType, setFlightClassType] = useState("");
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [passengerInfo, setPassengerInfo] = useState(null);

    const [outboundFlightID, setOutboundFlightID] = useState(null);
    const [returnFlightID, setReturnFlightID] = useState(null);

    const [outboundSeats, setOutboundSeats] = useState([]);
    const [returnSeats, setReturnSeats] = useState([]);

    const [isLoadingOutboundSeats, setIsLoadingOutboundSeats] = useState(false);
    const [isLoadingReturnSeats, setIsLoadingReturnSeats] = useState(false);

    const [selectedOutboundSeat, setSelectedOutboundSeat] = useState(null);
    const [selectedReturnSeat, setSelectedReturnSeat] = useState(null);

    const [overallError, setOverallError] = useState(null);
    const [outboundSeatError, setOutboundSeatError] = useState(null);
    const [returnSeatError, setReturnSeatError] = useState(null);
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
        const storedFlightData = localStorage.getItem("selectedFlight");
        const storedClassType = localStorage.getItem("class");
        const storedPassengerInfo = localStorage.getItem("passengerInfo");
        let parsedFlight = null;

        if(!storedPassengerInfo)
        {
            router.push('/');
            return;
        }

        if (storedFlightData) {
            try {
                parsedFlight = JSON.parse(storedFlightData);
                setFlightInfo(parsedFlight);
            } catch (err) {
                setOverallError('Failed to load flight data. Please select your flight again.');
                router.push('/');
                return;
            }
        } else {
            setOverallError('No flight selected. Please go back and select a flight.');
            router.push('/');
            return;
        }

        const classTypeToUse = storedClassType || parsedFlight?.flightClassType || "";
        if (!classTypeToUse) {
            setOverallError('Flight class type not found. Please re-select your flight options.');
            router.push('/');
            return;
        }
        setFlightClassType(classTypeToUse);

        if (parsedFlight) {
            const obFlightID = parsedFlight.OutboundFlightID || parsedFlight.flightId;
            const retFlightID = parsedFlight.ReturnFlightID;

            if (obFlightID) {
                setOutboundFlightID(obFlightID);
            } else {
                setOverallError('Essential outbound flight information is missing.');
            }

            if (retFlightID) {
                setIsRoundTrip(true);
                setReturnFlightID(retFlightID);
            } else {
                setIsRoundTrip(false);
            }
        }
    }, [router]);

    useEffect(() => {
        if (outboundFlightID && flightClassType) {
            setIsLoadingOutboundSeats(true);
            setOutboundSeatError(null);
            axios.post("http://localhost:8080/api/seats/getSeats", { flightID: outboundFlightID, flightClassType })
                .then(res => setOutboundSeats(res.data))
                .catch(err => {
                    setOutboundSeatError(err.response?.data?.message || 'Failed to load seats.');
                })
                .finally(() => setIsLoadingOutboundSeats(false));
        }
    }, [outboundFlightID, flightClassType]);

    useEffect(() => {
        if (isRoundTrip && returnFlightID && flightClassType) {
            setIsLoadingReturnSeats(true);
            setReturnSeatError(null);
            axios.post("http://localhost:8080/api/seats/getSeats", { flightID: returnFlightID, flightClassType })
                .then(res => setReturnSeats(res.data))
                .catch(err => {
                    setReturnSeatError(err.response?.data?.message || 'Failed to load seats.');
                })
                .finally(() => setIsLoadingReturnSeats(false));
        }
    }, [isRoundTrip, returnFlightID, flightClassType]);


    const handleSeatSelect = (seat, leg) => {
        if (seat.IsBooked) return;
        const newSelection = { seatID: seat.SeatID, seatNumber: seat.SeatNumber, className: seat.ClassName };

        if (leg === 'outbound') {
            setSelectedOutboundSeat(prev => prev?.seatID === seat.SeatID ? null : newSelection);
        } else if (leg === 'return') {
            setSelectedReturnSeat(prev => prev?.seatID === seat.SeatID ? null : newSelection);
        }
    };

    const canConfirm = useMemo(() => {
        if (overallError) return false;
        if (isRoundTrip) {
            return selectedOutboundSeat && selectedReturnSeat && !outboundSeatError && !returnSeatError;
        }
        return selectedOutboundSeat && !outboundSeatError;
    }, [isRoundTrip, selectedOutboundSeat, selectedReturnSeat, overallError, outboundSeatError, returnSeatError]);

    const handleConfirmSeats = () => {
        if (canConfirm) {
            localStorage.setItem('selectedOutboundSeat', JSON.stringify(selectedOutboundSeat));
            if (isRoundTrip && selectedReturnSeat) {
                localStorage.setItem('selectedReturnSeat', JSON.stringify(selectedReturnSeat));
            } else {
                localStorage.removeItem('selectedReturnSeat');
            }
            router.push('mealandpass');
        }
    };

    const isAisleAfter = (index, itemsPerRow = SEATS_PER_ROW) => (index % itemsPerRow) === Math.floor(itemsPerRow / 2) - 1;

    const seatButtonClasses = useMemo(() => ({
        base: "w-11 h-11 md:w-12 md:h-12 flex flex-col items-center justify-center rounded-md border text-[10px] md:text-xs font-medium focus:outline-none transition-all duration-150 ease-in-out transform focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950",
        available: "bg-zinc-800 border-zinc-700 text-gray-300 hover:border-white  hover:shadow-md hover:scale-105 focus:ring-white",
        booked: "bg-zinc-900/60 border-zinc-800/40 text-gray-600/80 cursor-not-allowed opacity-70",
        selected: "bg-blue-500 text-white scale-105 shadow-lg ring-2 ring-offset-2 ring-offset-zinc-950 ring-white",
    }), []);

    const getFlightLegDescription = (flightLegInfo, legType) => {
        if (!flightLegInfo) return `Details for ${legType} flight are unavailable.`;
        let origin = legType === "Outbound" ? flightInfo?.DepartureCity : flightInfo?.OutboundDepartureCity
        let destination = legType === "Outbound" ? flightInfo?.ArrivalCity : flightInfo?.OutboundArrivalCity;
        let flightNumber = legType === "Outbound" ? (flightInfo?.OutboundFlightNumber || flightInfo?.FlightNumber) : flightInfo?.ReturnFlightNumber;

        return `Flight ${flightNumber || ''}: ${origin || 'N/A'} to ${destination || 'N/A'}`;
    };


    if (overallError && !flightInfo) {
        return (
            <div className="min-h-screen bg-zinc-950 text-gray-100 p-8 flex flex-col items-center justify-center">
                 <SlidingHeader activeStep={'seats'} />
                <div className="mt-10 p-6 text-center bg-red-700 border border-red-800/50 rounded-lg text-red-400 max-w-md">
                    <h1 className="text-2xl font-extralight mb-3">Configuration Error</h1>
                    <p>{overallError}</p>
                    <Button onClick={() => router.push('/')} className="mt-6 bg-white  text-">Go to Homepage</Button>
                </div>
            </div>
        );
    }


    if (!authChecked) {
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
            <Loader />
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-gray-100 p-8 md:p-12 lg:p-16 selection:bg-black selection:text-white">
            <SlidingHeader activeStep={'seats'} />
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-8 md:mb-10">
                    <h1 className="text-4xl md:text-5xl font-extralight text-white mb-2">
                        Select Your Seats
                    </h1>
                    <p className="text-gray-400 text-base">
                        Class: <span className="font-semiextralight text-gray-300">{flightClassType || "N/A"}</span>
                    </p>
                </header>

                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 mb-8 text-base text-gray-400">
                    <div className="flex items-center"><span className="w-4 h-4 rounded-sm bg-zinc-900 border border-zinc-700 mr-2"></span>Available</div>
                    <div className="flex items-center"><span className="w-4 h-4 rounded-sm bg-red-500 border border-zinc-800/40 mr-2 opacity-70"></span>Booked</div>
                    <div className="flex items-center"><span className="w-4 h-4 rounded-sm bg-blue-500 border border-black mr-2"></span>Selected</div>
                </div>

                {/* Outbound Flight Section */}
                <section className="mb-10 md:mb-12 p-6  rounded-xl border border-zinc-700/50">
                    <h2 className="text-2xl md:text-3xl font-semiextralight text-white-400 mb-2 text-center">Outbound Flight</h2>
                    <p className="text-sm text-gray-400 mb-6 text-center">{getFlightLegDescription(flightInfo, "Outbound")}</p>
                    <SeatMapDisplay
                        seats={outboundSeats}
                        isLoading={isLoadingOutboundSeats}
                        selectedSeat={selectedOutboundSeat}
                        onSeatSelect={(seat) => handleSeatSelect(seat, 'outbound')}
                        flightLegLabel="Outbound"
                        isAisleAfterFn={isAisleAfter}
                        seatButtonClasses={seatButtonClasses}
                        skeletonCount={SKELETON_SEAT_COUNT}
                        seatsPerRow={SEATS_PER_ROW}
                        error={outboundSeatError}
                    />
                </section>

                {/* Return Flight Section (Conditional) */}
                {isRoundTrip && (
                    <section className="mb-10 md:mb-12 p-6  rounded-xl border border-zinc-700/50">
                        <h2 className="text-2xl md:text-3xl font-semiextralight text-white-400 mb-2 text-center">Return Flight</h2>
                        <p className="text-sm text-gray-400 mb-6 text-center">{getFlightLegDescription(flightInfo, "Return")}</p>
                        <SeatMapDisplay
                            seats={returnSeats}
                            isLoading={isLoadingReturnSeats}
                            selectedSeat={selectedReturnSeat}
                            onSeatSelect={(seat) => handleSeatSelect(seat, 'return')}
                            flightLegLabel="Return"
                            isAisleAfterFn={isAisleAfter}
                            seatButtonClasses={seatButtonClasses}
                            skeletonCount={SKELETON_SEAT_COUNT}
                            seatsPerRow={SEATS_PER_ROW}
                            error={returnSeatError}
                        />
                    </section>
                )}

                {/* Confirmation Area */}
                <div className="mt-8 md:mt-10 pb-8 text-center">
                     {(selectedOutboundSeat || (isRoundTrip && selectedReturnSeat)) && !overallError && (
                        <div className="mb-6 bg-zinc-900 rounded-lg inline-block shadow-md border border-zinc-700 space-y-2 max-w-sm mx-auto">
                            {selectedOutboundSeat && (
                                <p className="text-base text-gray-300">
                                    Outbound: <span className="font-extralight text-white">{selectedOutboundSeat.seatNumber}</span>
                                    {selectedOutboundSeat.className && <span className="text-gray-400 text-sm"> ({selectedOutboundSeat.className})</span>}
                                </p>
                            )}
                            {isRoundTrip && selectedReturnSeat && (
                                <p className="text-base text-gray-300">
                                    Return: <span className="font-extralight text-black-400">{selectedReturnSeat.seatNumber}</span>
                                    {selectedReturnSeat.className && <span className="text-gray-400 text-sm"> ({selectedReturnSeat.className})</span>}
                                </p>
                            )}
                        </div>
                    )}
                    <Button
                        onClick={handleConfirmSeats}
                        disabled={!canConfirm || isLoadingOutboundSeats || isLoadingReturnSeats}
                        size="lg"
                        className="w-sm px-10 py-5 bg-gray-700 hover:bg-gray-800 text-white text-lg font-extralight  ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Confirm selected seats and continue"
                    >
                        {(isLoadingOutboundSeats || isLoadingReturnSeats) ? "Loading Seats..." : (canConfirm ? "Confirm Seats & Continue" : "Select Your Seat(s)")}

                    </Button>
                     {!canConfirm && !overallError && !isLoadingOutboundSeats && !isLoadingReturnSeats && (isRoundTrip && selectedOutboundSeat && !selectedReturnSeat) && (
                        <p className="text-white-400 text-sm mt-3">Please select your return seat to continue.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SeatPicker;