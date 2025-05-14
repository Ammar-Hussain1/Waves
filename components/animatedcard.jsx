"use client"
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const AnimatedCard = ({ title, description, image, category, date }) => {
  const [isHovered, setIsHovered] = useState(false);

  const defaultImage = "https://images.unsplash.com/photo-1610147323479-a7fb11ffd5dd";
  const safeImage = image || defaultImage;
  
  return (
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-xl shadow-2xl transition-all duration-500 ease-in-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-w-16 aspect-h-20 relative">
          <img
            src={safeImage}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? "scale-105" : ""}`}
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
          />
        </div>

        <div
          className={`absolute inset-x-0 bottom-0 p-6 transform transition-transform duration-500 ease-out ${isHovered ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/80">{category}</span>
              <span className="text-sm font-medium text-white/80">{date}</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-sm text-white/90">{description}</p>
            <button className="group flex items-center space-x-2 text-white/90 hover:text-white transition-colors duration-300">
              <span>Explore More</span>
              <FaArrowRight className="transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-600 transition-all duration-1500 ease-out ${isHovered ? "w-full" : "w-0"}`}
        />

        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isHovered ? "opacity-0" : "opacity-100"}`}
        >
        
        </div>
      </div>
  );
};

AnimatedCard.defaultProps = {
  title: "Untitled Card",
  description: "No description available",
  image: "https://images.unsplash.com/photo-1610147323479-a7fb11ffd5dd",
  category: "Uncategorized",
  date: new Date().getFullYear().toString()
};

export default AnimatedCard;