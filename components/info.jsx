"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import Image from "next/image";

const flightSections = [
  {
    title: "Luggage Allowance",
    icon: "🧳",
    image: "/luggage.jpg",
    points: [
      "Economy: 1 checked bag (23kg), 1 carry-on (7kg)",
      "Business: 2 checked bags (32kg each), 1 carry-on (10kg)",
      "First Class: 3 checked bags (32kg each), 2 carry-ons (10kg each)",
    ],
  },
  {
    title: "Child Handling",
    icon: "👶",
    image: "/childcare.jpg",
    points: [
      "Priority boarding for families",
      "Complimentary baby strollers at the airport",
      "Child-friendly meals and entertainment",
      "Dedicated staff to assist with child needs",
    ],
  },
  {
    title: "Menu Selection",
    icon: "🍽️",
    image: "/meal.jpg",
    isDynamic: true,
  },
  {
    title: "Delay Information",
    icon: "⏰",
    image: "/delay.jpg",
    points: [
      "Real-time updates via SMS and email",
      "Lounge access for long delays",
      "Meal vouchers for 2+ hour delays",
      "Hotel arrangements for overnight delays",
    ],
  },
  {
    title: "Departure Situations",
    icon: "🛫",
    image: "/depart.jpg",
    points: [
      "Arrive at airport 3 hours before departure",
      "Check-in online to save time",
      "Keep travel documents handy",
      "Track your flight status in real-time",
    ],
  },
  {
    title: "In-Flight Entertainment",
    icon: "🎬",
    image: "/entertain.jpg",
    points: [
      "Touchscreen displays on all seats",
      "Hundreds of movies, TV shows, and music tracks",
      "Games and interactive maps",
      "Noise-canceling headphones provided",
    ],
  },
];

const classMenus = {
  Economy: ["Standard Meal", "Vegetarian", "Gluten-Free"],
  Business: ["Gourmet Meal", "Seafood", "Vegan"],
  First: ["Chef's Special", "Caviar Selection", "Exclusive Wines"],
};

export default function FlightInfo() {
  const [index, setIndex] = useState(0);
  const [selectedClass, setSelectedClass] = useState("Economy");
  const [scrollingDown, setScrollingDown] = useState(true);

  const handleNext = () => {
    if (index < flightSections.length - 1) {
      setScrollingDown(true); // Set direction before changing index
      setIndex(index + 1);
    }
  };
  
  const handlePrev = () => {
    if (index > 0) {
      setScrollingDown(false); // Set direction before changing index
      setIndex(index - 1);
    }
  };
  

  // Handle scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const newScrollDirection = currentScrollY > window.scrollY ? false : true;
      setScrollingDown(newScrollDirection);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const section = flightSections[index];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* AnimatePresence handles slide transition */}
      <AnimatePresence mode="sync">
      <motion.div
  key={index}
  initial={{
    y: index === 0 ? 0 : scrollingDown ? "100%" : "-10%",
    opacity: 0,
  }}
  animate={{ y: 0, opacity: 1 }}
  exit={{
    y: scrollingDown ? "-100%" : "100%",
    opacity: 0,
  }}
  transition={{ duration: 0.6, ease: "easeInOut" }}
  className="absolute inset-0 w-full h-full"
>

          {/* Background Image Layer */}
          <div className="absolute inset-0 -z-10">
            <Image
              src={section.image}
              alt={section.title}
              fill
              className="object-cover w-full h-full opacity-70"
              style={{ objectFit: "cover" }} // Add this line
              priority
            />
            <div className="absolute inset-0 bg-opacity-50" />
          </div>

          {/* Text Content Overlay */}
          <div className="flex flex-col justify-center items-center h-full text-black text-center px-6">
            {/* <div className="text-8xl mb-4">{section.icon}</div> */}
            <h1 className="text-3xl md:text-8xl font-extrabold font-stretch-95%  mb-6">{section.title}</h1>

            {section.isDynamic ? (
              <div className="w-full max-w-md">
                <label className="block mb-2 text-2xl font-semibold ">Select Class:</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-3 rounded-lg bg-black text-white mb-4"
                >
                  {Object.keys(classMenus).map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                <ul className="space-y-2 text-lg font-semibold text-black">
                  {classMenus[selectedClass].map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="space-y-2 text-xl  font-semibold max-w-xl">
                {section.points?.map((point, i) => (
                  <li key={i}>• {point}</li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows Centered Vertically */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center px-6 md:px-12 text-white transform -translate-y-1/2 z-20">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className={`p-3 rounded-full bg-black bg-opacity-50 ${
            index === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-opacity-80"
          }`}
        >
          <FaArrowUp />
        </button>
        <button
          onClick={handleNext}
          disabled={index === flightSections.length - 1}
          className={`p-3 rounded-full bg-black bg-opacity-50 ${
            index === flightSections.length - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-opacity-80"
          }`}
        >
          <FaArrowDown />
        </button>
      </div>
    </div>
  );
}
