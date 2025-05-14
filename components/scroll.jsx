"use client";
import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button"; 

const FloatingText = ({ align = "left", title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.4 }}
      className={`w-full flex ${align === "left" ? "justify-start" : "justify-end"} px-4 md:px-16`}
    >
      <div className="max-w-3xl backdrop-blur-lg p-8 shadow-xl text-left space-y-4">
        <h3 className="text-3xl md:text-5xl font-semibold text-white">{title}</h3>
        <p className="text-gray-300 text-base md:text-lg font-light">{description}</p>
        <Button className="mt-4 bg-white text-black hover:bg-gray-100 transition">Book Now</Button>
      </div>
    </motion.div>
  );
};


const ScrollImage = ({ src, alt, title, subtitle, paragraph }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.6, once: false });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      animate={{
        scale: isInView ? 1.05 : 0.9,
        opacity: isInView ? 1 : 0.8,
      }}
      transition={{
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative w-full overflow-hidden rounded-xl"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-[90vh] object-cover shadow-2xl rounded-xl"
      />

      {/* Overlay Content */}
      <motion.div
        style={{ translateY, opacity }}
        className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-black/60 backdrop-blur-sm px-6"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">{title}</h2>
        <p className="text-lg md:text-2xl italic text-gray-200 drop-shadow-md mb-4">
          {subtitle}
        </p>
        <p className="max-w-2xl text-sm md:text-lg text-gray-300 font-light">
          {paragraph}
        </p>
      </motion.div>
    </motion.div>
  );
};

const ScrollGallery = () => {
    const images = [
        {
          src: "/b1.jpg",
          alt: "Sadafly Jet",
          title: "Redefining Business Travel",
          subtitle: "Efficiency, elegance, and exclusivity — all in one place.",
          paragraph:
            "At Sadafly, we don't just transport you; we elevate the entire business travel experience. With private lounges, express boarding, and seamless onboard services, your journey starts with productivity and ends in style.",
        },
        {
          src: "/b2.jpg",
          alt: "Corporate Lounge",
          title: "Tailored For Professionals",
          subtitle: "Where ambition meets comfort.",
          paragraph:
            "Designed with corporate clients in mind, our fleet is equipped with high-speed Wi-Fi, private cabins, and gourmet meals. Every detail is crafted to help you work, relax, and arrive prepared — whether it's a pitch or a boardroom.",
        },
        {
          src: "/b3.jpg",
          alt: "Jet Interior",
          title: "Your Business, Our Priority",
          subtitle: "We fly with purpose, just like you.",
          paragraph:
            "Our partnerships with global corporations and executives reflect one thing: trust. At Sadafly, punctuality, discretion, and premium service are standard. Because when you fly with us, you're not just a passenger — you're a priority.",
        },
      ];
      

      return (
        <div className="space-y-40 px-4 md:px-16 py-24 bg-[#0d0d0d] text-white">
          <ScrollImage
            src={images[0].src}
            alt={images[0].alt}
            title={images[0].title}
            subtitle={images[0].subtitle}
            paragraph={images[0].paragraph}
          />
      
          <FloatingText
            align="left"
            title="Luxury That Works"
            description="Sadafly blends premium comfort with productivity tools so your time in the air feels like time well spent on the ground. Whether it’s closing deals or catching your breath — do it all in luxury."
          />
      
          <ScrollImage
            src={images[1].src}
            alt={images[1].alt}
            title={images[1].title}
            subtitle={images[1].subtitle}
            paragraph={images[1].paragraph}
          />
      
          <FloatingText
            align="right"
            title="Your Time, Maximized"
            description="Our tailored flight schedules and executive-only lounges ensure you get from meeting to milestone without the stress of traditional travel. At Sadafly, time is a luxury — and it’s always on your side."
          />
      
          <ScrollImage
            src={images[2].src}
            alt={images[2].alt}
            title={images[2].title}
            subtitle={images[2].subtitle}
            paragraph={images[2].paragraph}
          />
            <FloatingText
            align="right"
            title="Designed for the Driven"
            description="Every feature onboard is curated for leaders who value their time. From tranquil cabins to uninterrupted connectivity, Sadafly is where ambition meets altitude."
            />

        </div>
      );      
};

export default ScrollGallery;
