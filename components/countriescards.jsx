import React from "react";

const Card = () => {
  return (
    <div>
       <h1 className="text-5xl text-white mb-8 font-extralight text-center text-shadow-2xl text-shadow-gray">Explore The World Our Way</h1>

    <div className="container mx-auto px-4 flex justify-center items-center min-h-screen">
 
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="px-2">
          <SingleCard
            image="bali.png"
            CardTitle="Indonesia"
            titleHref="/#"
            btnHref="/countries/bali"
            CardDescription="Bali"
          />
        </div>
        <div className="px-2">
          <SingleCard
            image="canada.png"
            CardTitle="Canada"
             titleHref="/#"
            btnHref="/countries/canada"
            CardDescription="Banff"
          />
        </div>
        <div className="px-2">
          <SingleCard
            image="sydney.png"
            CardTitle="Australia"
             btnHref="/countries/sydney"
            CardDescription="Sydney"
          />
        </div>
        <div className="px-2">
          <SingleCard
            image="pak.png"
            CardTitle="Pakistan"
             btnHref="/countries/paki"
            CardDescription="Islamabad"
          />
        </div>
      </div>
    </div>
           </div>
  );
};

export default Card;

const SingleCard = ({ image, CardDescription, CardTitle, titleHref, btnHref }) => {
  return (
    // The main container for the card, now larger and without borders.
    // Increased max-width, adjusted margin and padding for a bigger feel.
    // Removed border classes and adjusted shadow for a sleeker look.
    // Dark background added to fit the theme of the reference image.
    <a
      href={btnHref || "#"}
      className="block bg-zinc-900 text-white m-6 max-w-2xl rounded-lg overflow-hidden transition-transform duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
    >
      <div className="relative group">
        {/* Image with slightly adjusted height and hover effect */}
        <img
          src={image}
          alt={CardTitle}
          className="w-full h-96 object-cover transition-opacity duration-300 group-hover:opacity-50"
        />
      </div>
      {/* Content area with adjusted padding and text styles */}
      <div className="p-6 text-left flex flex-col justify-between h-full">
        {/* Title section, keeping the structure but adjusting text style */}
        <h3 className="flex justify-between items-center mb-3 text-2xl font-light text-gray-200">
          {CardTitle}
          {/* Arrow icon - assuming 'arrow.png' exists or you'll replace it */}
          <img
            src="arrow.png"
            alt="Arrow"
            className="w-8 h-8 ml-3 filter invert group-hover:translate-x-1 transition-transform duration-200" // Added invert for dark theme and hover effect
          />
        </h3>
        {/* Description text with adjusted size and color */}
        <p className="mb-4 text-lg text-gray-400 font-normal">
          {CardDescription}
        </p>
      </div>
    </a>
  );
};

