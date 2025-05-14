"use client"
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils"; // Assuming you have this utility
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ value, onChange, label, className: popoverOuterClassName }) {
  // Internal state for the date object
  const [date, setDate] = useState(value ? new Date(value) : null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Effect to sync internal date state with the `value` prop
  useEffect(() => {
    if (value) {
      const propDate = new Date(value);
      // Check if the current internal date is different from the prop
      if (!date || propDate.getTime() !== date.getTime()) {
        setDate(propDate);
      }
    } else if (date !== null) { // If the external value is cleared, clear the internal date
      setDate(null);
    }
  }, [value]); // Rerun effect if `value` prop changes

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate || null); // Update internal state immediately for responsiveness
    setIsPopoverOpen(false); // Close the popover on date selection
    if (onChange) {
      if (selectedDate) {
        const formatted = format(selectedDate, "yyyy-MM-dd");
        onChange(formatted);
      } else {
        onChange(null); // Send null if date is cleared
      }
    }
  };

  return (
    // The className prop from FlightPicker (popoverOuterClassName) applies here to the Popover root.
    // This means bg-white/20, border-white/20, p-3 etc. from FlightPicker are applied to this Popover.
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} className={popoverOuterClassName}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"} // Outline variant by default adds a border
          className={cn(
            "w-xs justify-start text-left font-normal", // Take full width from parent Popover
            "h-12 px-4 py-2 md:h-12",                 // Increased height and consistent padding
            "bg-transparent",                     // Explicitly transparent to show parent's bg (e.g., bg-white/20 from FlightPicker)
            "text-white",                         // White text for selected date
            !date && "text-slate-300 hover:text-slate-200", // Lighter placeholder text, with hover improvement
            "border-white/30 hover:border-white/60", // Custom light border, distinct from Popover's border
            "focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900 focus:border-sky-400", // Enhanced focus style
            "text-base" // Ensure readable font size
          )}
        >
          <CalendarIcon className="mr-3 h-4 w-4 text-slate-300" /> {/* Icon color and margin */}
          {date && !isNaN(new Date(date).getTime()) ? (
            format(new Date(date), "PPP") // e.g., Dec 31st, 2023
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-zinc-950  border-none rounded-md" align="start">
        <Calendar
          mode="single"
          selected={date || undefined} // Pass internal date state
          onSelect={handleDateSelect}
          initialFocus
          disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))} // Disable past dates
          className="text-slate-100 p-2" // Base text color and padding for the calendar component
          classNames={{ // Shadcn UI Calendar theming for dark mode
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center h-10",
            caption_label: "text-sm font-medium text-slate-100",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100 text-slate-300 hover:text-sky-400 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-slate-800"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex justify-around",
            head_cell: "text-slate-400 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2 justify-around",
            cell: cn(
                "h-9 w-9 text-center text-sm p-0 relative",
                "[&:has([aria-selected].day-range-end)]:rounded-r-md",
                "[&:has([aria-selected].day-outside)]:bg-slate-700/50",
                "[&:has([aria-selected])]:bg-slate-700/50",
                "first:[&:has([aria-selected])]:rounded-l-md",
                "last:[&:has([aria-selected])]:rounded-r-md",
                "focus-within:relative focus-within:z-20"
            ),
            day: cn(
              "h-9 w-9 p-0 font-normal rounded-md transition-colors",
              "hover:bg-sky-700 hover:text-slate-50 focus:bg-sky-700 focus:text-slate-50 focus:outline-none",
              "aria-selected:opacity-100"
            ),
            day_selected:
              "bg-sky-600 text-sky-50 hover:bg-sky-600 hover:text-sky-50 focus:bg-sky-600 focus:text-sky-50",
            day_today: "bg-slate-700 text-sky-300 font-semibold",
            day_outside:
              "day-outside text-slate-500 opacity-50 aria-selected:bg-slate-700/50 aria-selected:text-slate-400 aria-selected:opacity-30",
            day_disabled: "text-slate-600 opacity-40 cursor-not-allowed",
            day_range_middle:
              "aria-selected:bg-slate-700/70 aria-selected:text-slate-100",
            day_hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}