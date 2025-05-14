"use client";

import { useState, useEffect } from 'react'; 
import AboutUs from "@/components/aboutus";
import FlightPicker from "@/components/checkFlights";
import Card from "@/components/countriescards";
import Plainvideo from "@/components/planevideo";
import '@/app/utilis/preLoads'; 
import SplitSection from "@/components/faqsway";
import AirlineStats from "@/components/stats";
import Loader from "@/components/loader"; 
import SignUpBar from '@/components/signupbar';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []); 

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col bg-zinc-950">
          <div className="md:block hidden">
            <Plainvideo />
          </div>
          <div className="relative h-[100px] ">
            <FlightPicker />
          </div>
          <section className="md:py-5 md:mt-0 mt-90">
            <Card />
          </section>
          <AirlineStats />
          <h1 className="text-xl text-gray-200 mt-20 mr-80 ml-80 font-mono text-left text-shadow-2xl text-shadow-gray">
            Why Waves?
          </h1>
          <h1 className="text-3xl text-gray-200 mt-10 mr-80 ml-80 font-mono text-left text-shadow-2xl text-shadow-gray">
            Soaring with cutting-edge aircraft technology and a passionate team dedicated to your comfort, Waves Airline is
            more than just a way to get from A to B. It's an experience crafted for the modern traveler. We are a service that
            empowers passengers to travel with ease, connect with the world, and arrive at their destination refreshed and ready.
            Choose Waves for a journey that's as smooth and inspiring as the ocean itself.
          </h1>
          <div className="relative w-full">
            <SplitSection />
          </div>
          <div className="bg-zinc-950">
            <AboutUs />
          </div>
          <SignUpBar/>
        </div>
      )}
    </>
  );
}