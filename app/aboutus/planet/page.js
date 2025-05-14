'use client';

import InteractiveGlobe from "@/components/globe";
import FloatingText from "@/components/floatingtext";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

export default function Planet() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: i * 0.3,
      },
    }),
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-start pt-16 space-y-16">

      {/* 1. Heading */}
      <h1 className="text-4xl md:text-6xl font-extralight">Our Planet</h1>

      {/* 2. Centered Interactive Globe */}
      <div className="w-full flex justify-center px-4">
        <InteractiveGlobe />
      </div>

<div className="text-white text-4xl font-extralight text-left ml-60 mt-40 mr-60">
  <h1>At Sadafly, we believe the skies belong to all of us—and so does the responsibility to protect them. From investing in fuel-efficient aircraft to offsetting our carbon footprint, we are reshaping air travel with a green conscience. Our innovations prioritize eco-efficiency, aiming to make every flight lighter on the environment and smoother for our future.</h1>
</div>
      {/* 3. Floating Text */}
    
      {/* 4. Scroll Animation Section */}
      <section className="w-full max-w-6xl px-4 md:px-8 py-20 space-y-32">
        {[
          {
            image: "/aircraft.jpg",
            title: "Fuel-Efficient Aircraft",
            text: "Our fleet includes the latest in fuel-efficient aviation technology, reducing CO₂ emissions and helping create a more sustainable future."
          },
          {
            image: "/carbon.jpg",
            title: "Carbon Offset Programs",
            text: "Sadafly partners with reforestation and clean energy projects worldwide to offset every mile our aircraft travel in the sky."
          },
          {
            image: "/green.jpg",
            title: "Green Skies Initiative",
            text: "We're leading the industry by investing in biofuel research and AI-optimized flight paths to reduce fuel consumption and environmental impact."
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            custom={index}
            className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={500}
              height={300}
              className="rounded-2xl shadow-xl"
            />
            <div className="max-w-xl space-y-4 text-left">
              <h3 className="text-3xl font-semibold">{item.title}</h3>
              <p className="text-gray-300">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
