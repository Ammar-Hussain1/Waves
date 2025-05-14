"use client";

import { useState,useEffect } from "react";
const Footer = () => {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className=" text-gray-300 px-4 py-16 border-t-1 border-t-gray-600">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-22">
        <div>
          <h3 className="text-xl font-extralight text-gray-300 mb-6">Subscribe</h3>
          <p className="text-md mb-4 text-gray-400">
            Join our newsletter to get the latest updates and offers.
          </p>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-md bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-700 transition text-gray-300 px-4 py-2 rounded-md text-md"
            >
              Subscribe
            </button>
          </form>
        </div>

      <div className="ml-10">
          <h3 className="text-xl font-extralight text-gray-100 mb-6">Explore</h3>
          <ul className="space-y-3 text-md">
            <li><a href="/contactus" className="hover:text-gray-300 transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-gray-300 transition">Book</a></li>
            <li><a href="/signup" className="hover:text-gray-300 transition">Sign Up</a></li>
            <li><a href="/signup" className="hover:text-gray-300 transition">Sign In</a></li>
            <li><a href="/aboutus/planet" className="hover:text-gray-300 transition">Our Planet</a></li>
            <li><a href="/aboutus/business" className="hover:text-gray-300 transition">Business</a></li>
            <li><a href="/aboutus/people" className="hover:text-gray-300 transition">People</a></li>
          </ul>
        </div>
        {/* Contact Info */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-extralight text-gray-300 mb-6">Contact</h3>
          <p className="text-lg text-gray-400 mb-4">
            Reach out at <span className="text-gray-300 hover:text-gray-300">contactus@waves.co.uk</span> or visit any of our offices:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300 font-medium text-md">📍 Head Office</p>
              <p className="text-gray-400">New York, USA</p>
            </div>
            <div>
              <p className="text-gray-300 font-medium text-md">🏢 Tech Office</p>
              <p className="text-gray-400">Berlin, Germany</p>
            </div>
            <div>
              <p className="text-gray-300 font-medium text-md">🛫 Travel Office</p>
              <p className="text-gray-400">Tokyo, Japan</p>
            </div>
            <div>
              <p className="text-gray-300 font-medium  text-md">🌱 Eco Office</p>
              <p className="text-gray-400">Oslo, Norway</p>
            </div>
            <div>
              <p className="text-gray-300 font-medium text-md">🌐 Global Office</p>
              <p className="text-gray-400">Sydney, Australia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom note */}
     <div className="border-t border-gray-800 mt-16 pt-6 text-center text-sm text-gray-500">
        &copy; {year && `${year} Our Company. All rights reserved.`}
      </div>
    </footer>
  );
};

export default Footer;
