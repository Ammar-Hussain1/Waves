'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SlidingHeader from "@/components/slider";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/app/utilis/auth";
import Loader from "@/components/loader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EnterInfo() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState([]);
  const [flightClass, setFlightClass] = useState("");
  const [flightType, setFlightType] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/signup?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setAuthChecked(true);
      }
    }
  }, [user, loading, router, pathname]);

  useEffect(() => {
    const storedFlight = localStorage.getItem("selectedFlight");
    const ftype = localStorage.getItem("type");
    const fclass = localStorage.getItem("class");

    if (storedFlight) setSelectedFlight(JSON.parse(storedFlight));
    if (ftype) setFlightType(ftype);
    if (fclass) setFlightClass(fclass);
  }, []);

  useEffect(() => {
    const updatedPassengers = Array.from(
      { length: passengerCount },
      (_, i) =>
        passengers[i] || {
          fullName: "",
          frequentFlyer: "",
          contact: {
            person: "Passenger Info",
            country: "",
            cellNumber: "",
            email: "",
            houseNumber: "",
            street: "",
            city: "",
          },
        }
    );
    setPassengers(updatedPassengers);
  }, [passengerCount]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        try {
          const response = await fetch(
            "http://localhost:8080/api/users/getUserInfo",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ UserID: parseInt(parsedUser.UserID) }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const userPassenger = {
              fullName: data.FullName || "",
              frequentFlyer: "",
              contact: {
                person: "Passenger Info",
                email: data.Email || "",
                cellNumber: data.PrimaryContact || "",
                country: data.Country || "",
                houseNumber: data.HouseNumber || "",
                street: data.Street || "",
                city: data.City || "",
              },
            };
            setPassengers([userPassenger]);
            setPassengerCount(1);
          }
        } catch (err) {
          toast.error("Failed to fetch user information.");
        }
      }
    };

    fetchUserInfo();
  }, []);

  if (!authChecked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
        <Loader />
      </div>
    );
  }

  const handlePassengerInfoChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };

    if (["title", "firstName", "lastName"].includes(field)) {
      const p = updated[index];
      updated[index].fullName = `${p.title || ""} ${p.firstName || ""} ${
        p.lastName || ""
      }`.trim();
    }

    setPassengers(updated);
  };

  const handleContactInfoChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index].contact = { ...updated[index].contact, [field]: value };
    setPassengers(updated);
  };

  const allFieldsFilled = passengers.every(
    (p) =>
      p.fullName &&
      p.contact.email &&
      p.contact.cellNumber &&
      p.contact.country &&
      p.contact.houseNumber &&
      p.contact.street &&
      p.contact.city
  );

  const proceedToMeal = async () => {
    if (!allFieldsFilled) {
      toast.warn(
        "Please fill all required passenger and contact details, including full address."
      );
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("User not found in local storage.");
      return;
    }

    const user = JSON.parse(storedUser);
    const passenger = passengers[0];

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/updateUserInfo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            UserID: user.UserID,
            fullName: passenger.fullName,
            HouseNumber: parseInt(passenger.contact.houseNumber),
            Street: passenger.contact.street,
            City: passenger.contact.city,
            Country: passenger.contact.country,
            PrimaryContact: passenger.contact.cellNumber,
            Email: passenger.contact.email,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        toast.error("Failed to update user information.");
        return;
      }

      localStorage.setItem("passengerCount", passengerCount.toString());
      localStorage.setItem("passengerInfo", JSON.stringify(passengers));
      router.push(`/displaySeats`);
    } catch (error) {
      toast.error("Error updating user information.");
    }
  };

  const inputBaseClasses =
    "w-full bg-zinc-800 text-gray-300 border border-zinc-700 rounded-md h-12 px-4 text-base focus:outline-none focus:border-blue-600 focus:ring-blue-600";
  const labelClasses = "block text-base font-medium text-gray-400 mb-2";
  const selectTriggerClasses =
    "w-full bg-zinc-800 text-gray-300 border border-zinc-700 rounded-md h-12 px-4 text-base focus:outline-none focus:border-blue-600 focus:ring-blue-600 flex items-center justify-between";
  const selectContentClasses =
    "bg-zinc-800 text-gray-300 border border-zinc-700 rounded-md";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-gray-300 p-12">
      <style>{`
        .Toastify__toast-container {
          z-index: 10000; /* Ensure it's on top of everything */
        }
      `}</style>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <SlidingHeader activeStep={"contact-info"} />
      <Card className="w-full max-w-5xl mx-auto bg-zinc-900 border-zinc-700 shadow-xl rounded-xl mt-16">
        <CardContent className="p-10 flex flex-col md:flex-row gap-16">
          <div className="flex-shrink-0 md:w-1/3 space-y-8">
            <h1 className="text-4xl font-extralight text-gray-200">Passenger Details</h1>
            <div className="bg-blue-900 bg-opacity-30 border border-blue-800 text-blue-400 p-6 rounded-lg">
              <h2 className="text-xl font-extralight mb-4">Important Information</h2>
              <ul className="list-disc list-inside space-y-3 text-base">
                <li>
                  All passengers travelling to and from Ghana must have a return
                  or onward ticket booked on the same itinerary.
                </li>
                <li>
                  Passengers traveling with more than three checked bags must
                  notify the airline 48 hours prior.
                </li>
                <li>
                  Electronic devices larger than phones require additional
                  security inspection.
                </li>
                <li>Personal food is prohibited on flights over 4 hours.</li>
              </ul>
            </div>
          </div>

          <div className="flex-grow space-y-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                proceedToMeal();
              }}
              className="space-y-8"
            >
              {passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="bg-zinc-800 rounded-lg p-8 shadow-md border border-zinc-700 space-y-8"
                >
                  <h2 className="text-2xl font-extralight text-gray-200 mb-6">
                    Passenger {index + 1}{" "}
                    <span className="text-base font-normal text-gray-400">
                      (Adult)
                    </span>
                  </h2>
                  <p className="text-base text-gray-400 mb-6">
                    Names must match passport exactly and be entered in English
                    characters.
                  </p>

                  <div>
                    <Label htmlFor={`fullName-${index}`} className={labelClasses}>
                      Full Name
                    </Label>
                    <Input
                      id={`fullName-${index}`}
                      type="text"
                      value={passenger.fullName}
                      onChange={(e) =>
                        handlePassengerInfoChange(
                          index,
                          "fullName",
                          e.target.value
                        )
                      }
                      className={inputBaseClasses}
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor={`frequentFlyer-${index}`}
                      className={labelClasses}
                    >
                      Frequent Flyer (optional)
                    </Label>
                    <Input
                      id={`frequentFlyer-${index}`}
                      type="text"
                      value={passenger.frequentFlyer}
                      onChange={(e) =>
                        handlePassengerInfoChange(
                          index,
                          "frequentFlyer",
                          e.target.value
                        )
                      }
                      className={inputBaseClasses}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-extralight text-gray-200 mb-4">
                      Contact Details
                    </h3>
                    <div className="space-y-6">
                      <div
                        className={`${inputBaseClasses} opacity-70 flex items-center h-12`}
                      >
                        {passenger.contact.person}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label
                            htmlFor={`houseNumber-${index}`}
                            className={labelClasses}
                          >
                            House Number
                          </Label>
                          <Input
                            type="text"
                            id={`houseNumber-${index}`}
                            placeholder="House Number"
                            value={passenger.contact.houseNumber}
                            onChange={(e) =>
                              handleContactInfoChange(
                                index,
                                "houseNumber",
                                e.target.value
                              )
                            }
                            className={inputBaseClasses}
                            required
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`street-${index}`}
                            className={labelClasses}
                          >
                            Street Name
                          </Label>
                          <Input
                            type="text"
                            id={`street-${index}`}
                            placeholder="Street Name"
                            value={passenger.contact.street}
                            onChange={(e) =>
                              handleContactInfoChange(
                                index,
                                "street",
                                e.target.value
                              )
                            }
                            className={inputBaseClasses}
                            required
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`city-${index}`}
                            className={labelClasses}
                          >
                            City
                          </Label>
                          <Input
                            type="text"
                            id={`city-${index}`}
                            placeholder="City"
                            value={passenger.contact.city}
                            onChange={(e) =>
                              handleContactInfoChange(
                                index,
                                "city",
                                e.target.value
                              )
                            }
                            className={inputBaseClasses}
                            required
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`country-${index}`}
                            className={labelClasses}
                          >
                            Country
                          </Label>
                          <Input
                            type="text"
                            id={`country-${index}`}
                            placeholder="Country"
                            value={passenger.contact.country}
                            onChange={(e) =>
                              handleContactInfoChange(
                                index,
                                "country",
                                e.target.value
                              )
                            }
                            className={inputBaseClasses}
                            required
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`cellNumber-${index}`}
                            className={labelClasses}
                          >
                            Cell Number
                          </Label>
                          <Input
                            type="tel"
                            id={`cellNumber-${index}`}
                            placeholder="Cell Number"
                            value={passenger.contact.cellNumber}
                            onChange={(e) =>
                              handleContactInfoChange(
                                index,
                                "cellNumber",
                                e.target.value
                              )
                            }
                            className={inputBaseClasses}
                            required
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`email-${index}`}
                            className={labelClasses}
                          >
                            Email
                          </Label>
                          <Input
                            type="email"
                            id={`email-${index}`}
                            placeholder="Email"
                            value={passenger.contact.email}
                            onChange={(e) =>
                              handleContactInfoChange(
                                index,
                                "email",
                                e.target.value
                              )
                            }
                            className={inputBaseClasses}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="submit"
                className="w-sm bg-gray-800 hover:bg-gray-900 ml-22 text-white text-lg py-6 rounded-md transition-colors font-light duration-200 justify-center"
              >
                Continue to Seat Selection
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}