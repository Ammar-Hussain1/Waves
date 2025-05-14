import React from 'react';

// This component displays content in a two-column layout,
// with a dark text/button section on the left and an image on the right,
// inspired by the provided image.
const SplitSection = ({
 
}) => {
  return (
    // Main container using flexbox for layout on larger screens
    // and stacking columns on smaller screens.
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-900 text-white m-40">

      {/* Left section for text content and buttons */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-extralight mb-6">
          Where the sky meets the horizon
        </h2>


        {/* Description */}
        <p className="text-lg md:text-xl text-gray-400 mb-10">
          Let Waves lift you above the everyday. From the ground swell of anticipation to the calm, boundless ocean of the sky, we are your wings. Join us on a voyage to new shores and endless possibilities.
        </p>

        {/* Buttons container */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Button 1 */}
          
            <a
              href={"/faq"}
              className="inline-block px-8 py-3 border border-white text-white text-center text-lg font-light rounded-md hover:bg-white hover:text-black transition duration-300"
            >
             Learn More
            </a>
    
        
        </div>
      </div>

      {/* Right section for the main image */}
      <div className="w-full md:w-1/2">
        <img
          src="/flowerplane.jpg"
          alt="Section Image"
          className="w-full h-full object-cover" // Ensure image covers the area
        />
      </div>
    </div>
  );
};

export default SplitSection;
