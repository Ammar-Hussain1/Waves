"use client";
import { motion } from 'framer-motion'; 
import { Button } from "@/components/ui/button"; 

import React, { useRef } from "react";

const FloatingText = ({ align, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.4 }}
      className={`w-full flex ${align === "left" ? "justify-start" : "justify-end"} px-4 md:px-16`}
    >
      <div className="max-w-full backdrop-blur-lg p-8 px-20 text-left space-y-4 bg-gray-950">
        <h3 className="text-3xl md:text-5xl font-semibold text-white">{title}</h3>
        <p className="text-gray-300 text-base md:text-lg font-light">{description}</p>
        <Button className="mt-1 bg-gray-400 text-white hover:bg-gray-100 transition">Explore More</Button>
      </div>
    </motion.div>
  );
};

export default FloatingText;
