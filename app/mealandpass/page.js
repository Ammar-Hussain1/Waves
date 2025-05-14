"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SlidingHeader from "@/components/slider";
import { useAuth } from "../utilis/auth";
import Loader from "@/components/loader";

// Meal data by class and type
const mealOptions = {
  Economy: {
    breakfast: [
      { name: "Omelette", desc: "A fluffy egg omelette with herbs and cheese." },
      { name: "Aloo Bhujia", desc: "Crispy spiced potato sticks served fresh." },
      { name: "Pancakes", desc: "Golden pancakes with maple syrup." },
    ],
    lunch: [
      { name: "Chicken Biryani", desc: "Aromatic rice with spiced chicken." },
      { name: "Vegetable Pasta", desc: "Pasta with seasonal vegetables in creamy sauce." },
      { name: "Grilled Sandwich", desc: "Stuffed sandwich grilled to perfection." },
    ],
    dinner: [
      { name: "Chicken Curry Rice", desc: "Savory chicken curry with steamed rice." },
      { name: "Vegetable Wrap", desc: "A soft wrap filled with veggies and sauce." },
      { name: "Beef Burger", desc: "Juicy beef patty with cheese and lettuce." },
    ],
  },
  Business: {
    breakfast: [
      { name: "Smoked Salmon Bagel", desc: "Toasted bagel with cream cheese and smoked salmon." },
      { name: "Avocado Toast", desc: "Sourdough topped with smashed avocado and poached egg." },
      { name: "Fruit Platter", desc: "A fresh selection of seasonal fruits." },
    ],
    lunch: [
      { name: "Lamb Kofta", desc: "Grilled lamb skewers with couscous and mint yogurt." },
      { name: "Mushroom Risotto", desc: "Creamy risotto with wild mushrooms and parmesan." },
      { name: "Club Sandwich", desc: "Triple-layered sandwich with chicken, bacon, and egg." },
    ],
    dinner: [
      { name: "Grilled Salmon", desc: "Fillet of salmon with lemon butter sauce and veggies." },
      { name: "Stuffed Bell Peppers", desc: "Peppers filled with quinoa, cheese, and vegetables." },
      { name: "Roast Chicken", desc: "Herb-roasted chicken with mashed potatoes and gravy." },
    ],
  },
  "First Class": {
    breakfast: [
      { name: "Eggs Benedict", desc: "Poached eggs and ham on English muffin with hollandaise." },
      { name: "Caviar with Blinis", desc: "Fine caviar served with mini pancakes and sour cream." },
      { name: "French Toast", desc: "Brioche toast with caramelized bananas and cream." },
    ],
    lunch: [
      { name: "Filet Mignon", desc: "Tender beef steak with red wine jus and truffle mash." },
      { name: "Lobster Thermidor", desc: "Classic French lobster dish with creamy white sauce." },
      { name: "Caprese Salad", desc: "Buffalo mozzarella, tomatoes, and basil with olive oil." },
    ],
    dinner: [
      { name: "Duck Confit", desc: "Slow-cooked duck leg with garlic potatoes and greens." },
      { name: "Sea Bass Fillet", desc: "Pan-seared sea bass with saffron risotto." },
      { name: "Gnocchi Alfredo", desc: "Handmade gnocchi in a rich Alfredo cream sauce." },
    ],
  },
};

const mealImages = {
  omelette: "/omlette.jpg",
  aloobhujia: "/aloo.jpg",
  pancakes: "/pancake.jpg",
  chickenbiryani: "/biryani.jpg",
  vegetablepasta: "/pasta.jpg",
  grilledsandwich: "/sandwich.jpg",
  chickencurryrice: "/curryrice.jpg",
  vegetablewrap: "/wrap.jpg",
  beefburger: "/burger.jpg",

  // BusinessClass
  smokedsalmonbagel: "/salmon_bagel.jpg",
  avocadotoast: "/avocado_toast.jpg",
  fruitplatter: "/fruit_platter.jpg",
  lambkofta: "/lamb_kofta.jpg",
  mushroomrisotto: "/mushroom_risotto.jpg",
  clubsandwich: "/club_sandwich.jpg",
  grilledsalmon: "/grilled_salmon.jpg",
  stuffedbellpeppers: "/stuffed_peppers.jpg",
  roastchicken: "/roast_chicken.jpg",

  // FirstClass
  eggsbenedict: "/eggs_benedict.jpg",
  caviarwithblinis: "/caviar_blinis.jpg",
  frenchtost: "/french_toast.jpg",
  filetmignon: "/filet_mignon.jpg",
  lobsterthermidor: "/lobster_thermidor.jpg",
  capresesalad: "/caprese_salad.jpg",
  duckconfit: "/duck_confit.jpg",
  seabassfillet: "/seabass.jpg",
  gnocchialfredo: "/gnocchi_alfredo.jpg"
};


export default function MealAndPassPage() {
  const [mealSelections, setMealSelections] = useState([]);
  const [numPassengers, setNumPassengers] = useState(0);
  const [flightClass, setFlightClass] = useState("");
  const [flight, setFlight] = useState(null);
  const [flightType, setFlightType] = useState("");
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
  }, [user, loading, router]);
  useEffect(() => {
    const storedCount = localStorage.getItem("passengerCount");
    const fClass = localStorage.getItem("class");
    const flightItem = localStorage.getItem("selectedFlight");
    const selectedOutboundSeats = localStorage.getItem("selectedOutboundSeat");
    const flightTypeLoad = localStorage.getItem("type");
    if (!selectedOutboundSeats) {
      window.location.href = "/";
    }

    if(flightTypeLoad)
    {
      setFlightType(flightTypeLoad);
    }
    else
    {
      window.location.href = "/";
    }

    if (storedCount) {
      setNumPassengers(parseInt(storedCount, 10));
    }
    else
    {
      window.location.href = "/";
    }

    if (fClass) {
      setFlightClass(fClass);
    }
    else
    {
      window.location.href = "/";
    }

    if (flightItem) {
        setFlight(JSON.parse(flightItem));
    }
    else
    {
      window.location.href = "/";
    }
  }, []);

  const calculateDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const diffMs = new Date(end) - new Date(start);
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const getMealTypes = () => {
    if(flightType == "round-trip")
    {
      const duration = calculateDuration(
        flight?.OutboundDepartureTime,
        flight?.OutboundArrivalTime
      );
      const hours = parseInt(duration.split("h")[0], 10);
      if (hours < 3) return ["breakfast"];
      if (hours < 10) return ["breakfast", "lunch"];
      return ["breakfast", "lunch", "dinner"];
    }
    else
    {
     const duration = calculateDuration(
        flight?.DepartureTime,
        flight?.ArrivalTime
      );
      const hours = parseInt(duration.split("h")[0], 10);
      if (hours < 3) return ["breakfast"];
      if (hours < 10) return ["breakfast", "lunch"];
      return ["breakfast", "lunch", "dinner"]; 
    }
  };

  const handleMealSelect = (index, type, meal) => {
    const updatedSelections = [...mealSelections];

    if (!updatedSelections[index]) updatedSelections[index] = {};
    updatedSelections[index][type] = meal.name;

    setMealSelections(updatedSelections);

    // Save updated selections to localStorage
  };

  const renderMeals = (passengerIndex) => {
    const options = mealOptions[flightClass] || {};
    const types = getMealTypes();

    return types.map((type) => (
      <div key={type} className="mb-6 bg-zinc-950">
        <h3 className="text-3xl font-bold text-center capitalize text-white mb-6">
          {type}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {options[type]?.map((meal) => {
            const isSelected =
              mealSelections[passengerIndex]?.[type] === meal.name;
            const imageKey = meal.name.replace(/\s+/g, "").toLowerCase();
            const imagePath = mealImages[imageKey] || "/default.jpg";

            return (
              <motion.div
                key={meal.name}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative group rounded-xl border-4 p-4 bg-black text-white shadow-lg transition duration-300 ${
                  isSelected ? "border-gray-800" : "border-black"
                }`}
              >
                <div className="flex justify-center items-center h-60 w-full">
                  <Image
                    src={imagePath}
                    alt={meal.name}
                    width={200}
                    height={200}
                    className="rounded-full h-60 w-60 object-cover transition group-hover:brightness-90 group-hover:blur-[1px]"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-center">
                    {meal.name}
                  </h4>
                  <p className="text-sm text-center text-gray-300">
                    {meal.desc}
                  </p>
                </div>
                <div className="absolute inset-0 backdrop-blur-sm flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                  <p className="text-gray-300 text-sm mb-4 text-center px-3">
                    {meal.desc}
                  </p>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white p-3"
                    onClick={() => handleMealSelect(passengerIndex, type, meal)}
                  >
                    {isSelected ? "Selected" : "Select Meal"}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    ));
  };

  const handleSave = () => {
    localStorage.setItem("mealSelections", JSON.stringify(mealSelections));
    router.push(`/summary`);
  };

  if (!authChecked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white py-12 px-6 md:px-16 font-sans">
      <SlidingHeader activeStep={"meals"} />
      <h1 className="text-4xl font-bold mb-10 text-center text-white">
        Choose Your Meal
      </h1>

      {[...Array(numPassengers)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="mb-20 border-b border-gray-700 pb-10"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center text-white">
            Passenger {index + 1}
          </h2>
          {renderMeals(index)}
        </motion.div>
      ))}

      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition"
          onClick={handleSave}
        >
         Proceed to Summary
        </motion.button>
      </div>
    </div>
  );
}
