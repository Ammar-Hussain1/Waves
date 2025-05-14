// SeatMapDisplay.js (or define within SeatPicker.js if preferred)
import React from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' '); // Helper for class names

export default function SeatMapDisplay({
    seats,
    isLoading,
    selectedSeat,
    onSeatSelect,
    flightLegLabel,
    isAisleAfterFn,
    seatButtonClasses, // Object with base, available, booked, selected styles
    skeletonCount,
    seatsPerRow,
    error // Optional error message for this specific leg
}) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-6 gap-x-1.5 gap-y-3 md:gap-x-2 md:gap-y-3 p-3 md:p-4 bg-slate-800/50 rounded-xl shadow-lg border border-slate-700/50">
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <div
                        key={`skeleton-${flightLegLabel}-${index}`}
                        className={cn(
                            "w-12 h-12 md:w-14 md:h-14 rounded-md bg-slate-700 animate-pulse",
                            isAisleAfterFn(index, seatsPerRow) ? 'mr-1.5 md:mr-2 lg:mr-3' : ''
                        )}
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 my-4 text-center bg-red-900/20 border border-red-700/50 rounded-lg text-red-300">
                <p className="font-medium">Could not load seats for {flightLegLabel.toLowerCase()} flight.</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    if (!seats || seats.length === 0) {
        return (
            <div className="text-center py-8 px-4 text-slate-500 bg-slate-800/60 rounded-xl my-4">
                 <svg className="mx-auto h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="font-semibold">No seats currently available for the {flightLegLabel.toLowerCase()} flight.</p>
            </div>
        );
    }

    return (
        <div className="p-3 md:p-4 bg-slate-800/70 rounded-xl shadow-xl border border-slate-700/60">
            <div className="grid grid-cols-6 gap-x-1.5 gap-y-3 md:gap-x-2 md:gap-y-3">
                {seats.map((seat, index) => (
                    <button
                        key={`${flightLegLabel}-${seat.SeatID}`}
                        className={cn(
                            seatButtonClasses.base,
                            seat.IsBooked ? seatButtonClasses.booked : (selectedSeat?.seatID === seat.SeatID ? seatButtonClasses.selected : seatButtonClasses.available),
                            isAisleAfterFn(index, seatsPerRow) ? 'mr-1.5 md:mr-2 lg:mr-3' : ''
                        )}
                        onClick={() => onSeatSelect(seat)} // Parent's onSeatSelect will handle which leg
                        disabled={seat.IsBooked}
                        aria-label={`Seat ${seat.SeatNumber} for ${flightLegLabel}. ${seat.IsBooked ? 'Booked.' : selectedSeat?.seatID === seat.SeatID ? 'Currently selected.' : 'Available.'}`}
                        aria-pressed={selectedSeat?.seatID === seat.SeatID}
                    >
                        {seat.SeatNumber}
                    </button>
                ))}
            </div>
        </div>
    );
}