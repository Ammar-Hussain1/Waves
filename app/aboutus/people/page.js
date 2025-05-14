'use client'; // Ensures client-side rendering

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FiMail, FiLinkedin } from "react-icons/fi";

const OurPeople = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      // You might want to adjust the offset depending on your layout
      // offset: 50,
    });
    // Refresh AOS on window resize or content changes if necessary
    // AOS.refresh();
  }, []);

  const team = [
    {
      name: "Johnson Daz",
      role: "Chief Executive Officer",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      email: "daz.j@company.com",
      linkedin: "#" // Replace with actual LinkedIn URL
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      email: "michael.c@company.com",
      linkedin: "#" // Replace with actual LinkedIn URL
    },
    {
      name: "Emma Rodriguez",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      email: "emma.r@company.com",
      linkedin: "#" // Replace with actual LinkedIn URL
    },
    {
      name: "David Kim",
      role: "Senior Developer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      email: "david.k@company.com",
      linkedin: "#" // Replace with actual LinkedIn URL
    },
    {
      name: "Sophia Patel",
      role: "Product Manager",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      email: "sophia.p@company.com",
      linkedin: "#" // Replace with actual LinkedIn URL
    },
    {
      name: "James Wilson",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef",
      email: "james.w@company.com",
      linkedin: "#" // Replace with actual LinkedIn URL
    }
  ];

  return (
    // Main container with dark background and generous padding
    <div className="min-h-screen bg-zinc-950 text-gray-300 py-24 px-4 sm:px-8 lg:px-16"> {/* Adjusted padding and base text color */}
      <div className="max-w-8xl mx-auto"> {/* Slightly wider max-width */}
        {/* Header section with desolate-toned text */}
        <div className="text-center mb-24" data-aos="fade-up"> {/* Increased bottom margin */}
          {/* Title with a muted, dusty gradient */}
          <h1 className="text-5xl md:text-6xl font-extralight mb-6 bg-white bg-clip-text text-transparent"> {/* Adjusted text size and gradient colors */}
            Our People
          </h1>
          {/* Subtitle with muted text color */}
          <p className="text-white text-xl md:text-2xl font-extralight"> {/* Adjusted text size and color */}
            Meet the talented individuals who navigate the desolate digital frontier
          </p>
        </div>

        {/* Grid for team members with increased gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 md:gap-24"> {/* Increased gap */}
          {team.map((member, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 150} // Slightly increased delay increment
              // Card styling: dark, semi-transparent, subtle border on hover, lift effect
              className="group relative overflow-hidden rounded-xl bg-zinc-950 p-7 border border-transparent hover:bg-zinc-900 " /* Adjusted background, border, hover states, and lift */
            >
              {/* Image container with subtle overlay */}
              <div className="relative mb-7 overflow-hidden rounded-xl"> {/* Adjusted bottom margin */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover object-center transform group-hover:scale-110 transition-transform duration-300" // Adjusted image height
                />
                {/* Subtle dark gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/30 opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div> {/* Adjusted gradient colors and opacity */}
              </div>

              {/* Text content */}
              <h3 className="text-2xl font-light text-gray-200 mb-2">{member.name}</h3> {/* Slightly lighter name color */}
              <p className="text-yellow-300 mb-5">{member.role}</p> {/* Muted, dusty color for role */}

              {/* Social icons with subtle color change on hover */}
              <div className="flex space-x-5"> {/* Adjusted spacing */}
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center text-gray-400 hover:text-blue-600 transition-colors duration-300" // Muted default, subtle hover
                >
                  <FiMail className="mr-2" />
                  <span>Email</span>
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-blue-600 transition-colors duration-300" // Muted default, subtle hover
                >
                  <FiLinkedin className="mr-2" />
                  <span>LinkedIn</span>
                </a>
              </div>

              {/* Decorative border on hover (can keep or remove based on preference) */}
              {/* <div className="absolute top-0 left-0 w-full h-full border-2 border-transparent group-hover:border-purple-600/50 rounded-xl transition-all duration-300"></div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurPeople;