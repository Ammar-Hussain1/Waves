"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

import {
  FaGooglePlusG,
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

export default function LoginPage() {
  const [isActive, setIsActive] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    usertype: "Customer",
  });
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [notification, setNotification] = useState(null); 

  const router = useRouter();

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  console.log("Redirect param:", redirect);


  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000); 
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      if (!signUpData.name || !signUpData.email || !signUpData.password) {
        showNotification("error", "Please fill in all fields.");
        return;
      }

      console.log(signUpData);
      const res = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });
      const result = await res.json();
      if (res.ok) {
        showNotification("success", "Registered successfully!");
        setIsActive(false); 
        setSignUpData({ name: "", email: "", password: "", usertype: "Customer" });
      } else {
        showNotification("error", result.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Server error");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      if (!signInData.email || !signInData.password) {
        showNotification("error", "Please enter both email and password.");
        return;
      }

      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login success:", data);
        localStorage.setItem("user", JSON.stringify(data.user)); 
        showNotification("success", "Logged in successfully!");
        if (data.user["UserType"] !== "Admin") {
          window.location.href = redirect || '/';
        } else {
          window.location.href = redirect || "/dashboard"; 
        }
      } else {
        showNotification("error", data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      showNotification("error", "Server error");
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100 overflow-hidden">
      <div
        className={`relative w-full h-full bg-zinc-900 shadow-lg overflow-hidden transition-all duration-500 ${
          isActive ? "auth-active" : ""
        }`}
      >
        {/* Sign Up Form */}
        <div
          className={` bg-zinc-900 absolute top-0 h-full w-1/2 p-10 flex flex-col justify-center items-center transition-all duration-500 ${
            isActive
              ? "translate-x-full opacity-100 z-10 animate-fadeIn"
              : "opacity-0 z-0"
          }`}
        >
          <form className="w-full max-w-sm items-right" onSubmit={handleSignUp}>
            <h1 className="text-3xl text-white font-bold">Create Account</h1>
            <span className="text-sm text-gray-500">
              or use your email for registration
            </span>
            <Input
              placeholder="Name"
              value={signUpData.name}
              onChange={(e) =>
                setSignUpData({ ...signUpData, name: e.target.value })
              }
            />
            <Input
              type="email"
              placeholder="Email"
              value={signUpData.email}
              onChange={(e) =>
                setSignUpData({ ...signUpData, email: e.target.value })
              }
            />
            <Input
              type="password"
              placeholder="Password"
              value={signUpData.password}
              onChange={(e) =>
                setSignUpData({ ...signUpData, password: e.target.value })
              }
            />
            <button   className=" text-black mt-4 bg-gray-400 py-2 px-7 rounded-md text-md font-semibold uppercase tracking-wider hover:bg-gray-600 shadow-2xl hover:text-white ">
              Sign Up
            </button>
            {/* Mobile toggle to Sign In */}
            <button
              type="button"
              className="mt-4 text-xs text-blue-600 sm:hidden"
              onClick={() => setIsActive(false)}
            >
              Already have an account? <span className="underline text-white">Sign In</span>
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div
          className={`absolute top-0 h-full w-1/2 p-10 flex flex-col justify-center items-center transition-all duration-500 ${
            isActive ? "translate-x-full opacity-0 z-0" : "opacity-100 z-10"
          }`}
        >
          <form className="w-full max-w-sm" onSubmit={handleSignIn}>
            <h1 className="text-3xl font-bold text-white">Sign In</h1>
            <span className="text-sm text-gray-500">
              or use your email password
            </span>

            <Input
              type="email"
              placeholder="Email"
              value={signInData.email}
              onChange={(e) =>
                setSignInData({ ...signInData, email: e.target.value })
              }
            />
            <Input
              type="password"
              placeholder="Password"
              value={signInData.password}
              onChange={(e) =>
                setSignInData({ ...signInData, password: e.target.value })
              }
            />

            <a href="#" className="text-xs text-gray-400 mt-2 block">
              Forget Your Password?
            </a>

            <button
              type="submit"
               className=" text-black bg-gray-400 py-2 px-7 mt-4 rounded-md text-md font-semibold uppercase tracking-wider hover:bg-gray-600 shadow-2xl hover:text-white "
               
            >
              Sign In
            </button>

            <button
              type="button"
              className="mt-4 text-xs text-blue-600 sm:hidden"
              onClick={() => setIsActive(true)}
            >
              Don't have an account? <span className="underline">Sign Up</span>
            </button>
          </form>
        </div>
        {/* Toggle Panel */}
        <div
          className={`absolute top-0 left-0 w-4xl h-full transition-all duration-600 hidden sm:block sm:w-1/2 sm:left-1/2 ${
            isActive ? "-translate-x-full" : ""
          }`}
        >
          <div
            className="bg-[url('/airwing.jpg')] bg-cover bg-zinc-900 bg-center h-full w-full sm:w-[200%] flex items-center justify-center text-white"
          >
            <div
              className="w-1/2 transition-all duration-500 flex flex-col items-center justify-center mr-240 bg-transparent bg-opacity-50 p-4 rounded"
              style={{
                marginLeft: isActive ? "0" : "0",
                marginRight: isActive ? "auto" : "2",
              }}
            >
              <h1 className="text-3xl font-bold mb-2 text-white">
                {isActive ? "Welcome Back!" : "Hello, Friend!"}
              </h1>
              <p className="text-sm mb-4 text-center text-white">
                {isActive
                  ? "Enter your personal details to use all of site features"
                  : "Register with your personal details to use all of site features"}
              </p>
              <button
                className=" text-black bg-gray-400 py-2 px-7 rounded-md text-md font-semibold uppercase tracking-wider hover:bg-gray-600 shadow-2xl hover:text-white "
                onClick={() => setIsActive(!isActive)}
              >
                {isActive ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 rounded-md shadow-lg py-3 px-6 text-white font-semibold transition-all duration-300 ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } ${notification.type === "success" ? "animate-slideInRight" : "animate-shake"}`}
          >
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
}

// Input Field Component
function Input({ type = "text", placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value} 
      onChange={onChange}
      className="w-full my-2 p-2 rounded bg-gray-100 text-sm focus:outline-none"
    />
  );
}

function IconLink({ Icon }) {
  return (
    <a
      href="#"
      className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-600 hover:text-white hover:bg-blue-500 transition"
    >
      <Icon />
    </a>
  );
}