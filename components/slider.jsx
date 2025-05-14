'use client';

import React from 'react';
// Assuming you have a utility for classnames like cn from shadcn/ui
// If not, you can replace `cn` with a simple helper function:
// function cn(...classes) { return classes.filter(Boolean).join(' '); }
import { cn } from '@/lib/utils';

// Define the steps with their unique IDs and labels
const steps = [
  { id: 'contact-info', label: 'Contact Info' },
  { id: 'seats', label: 'Seats' },
  { id: 'meals', label: 'Meals' },
  { id: 'summary', label: 'Summary' },
  { id: 'payment', label: 'Payment' },

];

// Define placeholder icons (you can replace these with actual SVG components or an icon library)
// This is a functional component that returns SVG, which is standard for React icons in JSX
const PlaceholderIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.535a.75.75 0 0 0 1.172.92l3.742-4.161Z"
      clipRule="evenodd"
    />
  </svg>
);


const SlidingHeader = ({ activeStep }) => {
  const activeIndex = steps.findIndex(step => step.id === activeStep);

  // Calculate the width of the blue progress bar based on the active step's index
  // It should reach the center of the active step's dot.
  const progressPercentage = activeIndex >= 0 ? (activeIndex / (steps.length - 1)) * 100 : 0;


  return (
    <div className="w-full py-10 mb-5 px-4 ">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex justify-between items-center">

          {/* Progress Bar Track (Gray) */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 -translate-y-1/2"></div>

          {/* Progress Bar Fill (Blue) */}
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-blue-300 -translate-y-1/2 transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>

          {/* Steps */}
          {steps.map((step, index) => {
            const isCompletedStep = index < activeIndex;
            const isCurrentStep = index === activeIndex;
            const isFutureStep = index > activeIndex;

            return (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center"
                // Using a small width here to help `justify-between` space them out
                // The actual size is determined by the dot and label
                style={{ width: '1px' }}
              >
                {/* Dot */}
                 <div className={cn(
                    "w-3 h-3 rounded-full border-2",
                    isCompletedStep ? "border-blue-400 bg-blue-400" :
                    isCurrentStep ? "border-blue-400 bg-white" : // Current step dot is blue border, white fill
                    "border-gray-400 bg-gray-300" // Future step dot is gray border, gray fill
                 )}></div>

                {/* Label */}
                <div className={cn(
                  "absolute top-full mt-2 text-sm font-semibold whitespace-nowrap", // Position label below the dot
                   "transform -translate-x-1/2 left-1/2", // Center the label relative to the dot's position
                  isCompletedStep ? "text-blue-400" :
                  isCurrentStep ? "text-blue-400" :
                  "text-gray-400"
                )}>
                  {step.label}
                </div>

                {/* Optional: Add icon above the label if desired, similar to the user's description but not the image */}
                {/* <div className="mb-1">
                    <PlaceholderIcon
                        className={cn(
                            "w-5 h-5",
                             isCompletedStep ? "text-blue-400" :
                             isCurrentStep ? "text-blue-400" :
                             "text-gray-400"
                        )}
                    />
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SlidingHeader;