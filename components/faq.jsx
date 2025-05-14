'use client'; 
import React, { useState } from 'react';
import { motion } from 'framer-motion'; 

const faqData = [
  {
    question: "What is Waves?",
    answer:
      "Waves is a travel platform designed to help travelers book flights, accommodations, and transportation with ease. We focus on delivering great experiences for wanderers across the world.",
  },
  {
    question: "How can I book a flight on Waves?",
    answer:
      "Simply search for flights by entering your departure and destination cities, dates, and preferences. We'll show you the best available options, and you can book directly through our platform.",
  },
  // Added new questions about Waves
  {
    question: "What makes Waves Airline different?",
    answer:
      "Waves Airline focuses on a seamless, modern travel experience. We utilize cutting-edge aircraft technology, prioritize passenger comfort with spacious seating and amenities, and are committed to sustainable travel practices.",
  },
   {
    question: "Does Waves Airline fly to international destinations?",
    answer:
      "Yes, Waves Airline operates flights to a growing number of international destinations in addition to our extensive domestic routes. You can find our current routes using our flight search tool.",
  },
   {
    question: "What kind of in-flight experience can I expect with Waves?",
    answer:
      "On a Waves flight, you can expect comfortable seating, a selection of in-flight entertainment options, and attentive service from our cabin crew. We also offer Wi-Fi on select aircraft.",
  },
  // End of new questions
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit cards, debit cards, PayPal, and Bitcoin for booking flights, accommodations, and tours.",
  },
  {
    question: "Can I change or cancel my booking?",
    answer:
      "Yes! You can change or cancel your booking through our website. Please refer to our cancellation policy for specific terms and conditions based on your booking.",
  },
  {
    question: "Do you offer travel insurance?",
    answer:
      "Yes, we offer various travel insurance plans that cover health, trip cancellations, and baggage loss. You can add this option when booking your trip.",
  },
  {
    question: "Is there customer support available?",
    answer:
      "Yes, our customer support team is available 24/7 via chat, email, or phone. We're here to help with anything from booking issues to general travel advice.",
  },
];
const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle the active state
  };

  return (

    <div className='bg-zinc-950 py-16'> 
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl md:text-4xl font-extralight text-center text-white mb-12"> 
          Frequently Asked Questions
        </h1>

        <div className="space-y-12"> 
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }} 
              className="rounded-none border border-zinc-700 p-5 bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200 ease-in-out" // Dark background, subtle border, hover effect
            >
     
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleAnswer(index)}
              >
                <h2 className="text-lg md:text-xl font-light text-gray-300">{faq.question}</h2> 
                <span
                  className={`text-white text-xl font-light transform transition-transform duration-200 ${ 
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  &#x25BC; 
                </span>
              </div>

              {activeIndex === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  transition={{ duration: 0.3, ease: "easeInOut" }} 
                  className="mt-4 text-white font-light overflow-hidden" 
                >
                  {faq.answer}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;