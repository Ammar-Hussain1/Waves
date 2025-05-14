"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, UserRound, LogOut } from "lucide-react";
import BookingsPage from "@/app/bookings/page";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/app/utilis/auth";
import Image from "next/image";

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    window.location.reload();
    router.refresh();
  };

  const navLinks = [
    { name: "Contact Us", href: "/contactus" },
    { name: "Track Flight", href: "/trackflight" },
    ...(user ? [{ name: "Bookings", href: "/bookings" }] : []),
    ...(user?.UserType === "Admin"
      ? [{ name: "Dashboard", href: "/dashboard" }]
      : []),
  ];

  return (
    <div className="relative w-full flex flex-col bg-transparent">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="bg-zinc-950 px-4 md:px-6 xl:px-10 py-6 mx-auto">
          <div className="flex justify-between items-center">
            <nav className="hidden lg:flex items-center space-x-5 pl-45">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="default"
                    className="text-white bg-gray-700 hover:bg-gray-500 transition-colors duration-300"
                  >
                    Book
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-50 p-5 bg-black rounded-md  borderanimate-fade-in-down"
                  align="start"
                >
                  <ul className="flex flex-col">
                    <li>
                      <Link
                        href="/#"
                        className="text-sm text-gray-200 hover:text-white hover:font-semibold  transition-all duration-200"
                      >
                        Flight
                      </Link>
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>

              {navLinks.map((link) => (
                <Link href={link.href} key={link.name}>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white hover:text-black  text-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-200 active:bg-gray-300"
                  >
                    {link.name}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="animate-pulse rounded-full bg-gray-700 h-8 w-8"></div>
              ) : user ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full h-10 w-10 overflow-hidden border-2 border-gray-700 hover:border-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      {user.profilePicture ? (
                        <Image
                          src={user.profilePicture}
                          alt="User Profile"
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <UserRound className="h-6 w-6 text-white" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-40 p-3 bg-white rounded-md shadow-md border border-gray-300 animate-fade-in-down"
                    align="end"
                  >
                    <div className="pb-2 border-b border-gray-200 mb-2">
                      <p className="text-sm font-semibold text-gray-800 text-center">
                        {user.username}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-black bg-white hover:bg-zinc-900 hover:text-white  text-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-200 active:bg-gray-300"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Logout</span>
                    </Button>
                  </PopoverContent>
                </Popover>
              ) : (
                <Button
                  variant="secondary"
                  asChild
                  className="text-black bg-white hover:bg-zinc-900 hover:text-white  text-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-200  focus:bg-transparent focus:text-white"
                >
                  <Link href="/signup">Sign In</Link>
                </Button>
              )}

              <CollapsibleTrigger asChild>
                <Button
                  onClick={() => setIsOpen(!isOpen)}
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {isOpen ? (
                    <p className="text-white text-2xl font-bold">X</p>
                  ) : (
                    <Menu className="h-7 w-7 text-white" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </div>

        <CollapsibleContent className="lg:hidden bg-gray-800 py-4 animate-slide-in-from-bottom">
          <nav className="flex flex-col space-y-2 px-4">
            <div className="flex flex-col">
              <span className="text-white font-medium">Book</span>
              <div className="ml-4 flex flex-col space-y-1 mt-1">
                <Link
                  href="/flight"
                  className="text-gray-300 text-sm hover:text-white transition-colors duration-300"
                >
                  Flight
                </Link>
              </div>
            </div>
            <Separator className="bg-gray-700" />
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.name}
                className="w-full font-medium p-2 rounded-md text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
            <Separator className="bg-gray-700" />
            {user ? (
              <>
                {user.username && (
                  <div className="pb-2 border-b border-gray-700 mb-2">
                    <p className="text-sm font-semibold text-gray-300 text-center">
                      {user.username}
                    </p>
                  </div>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-md transition-colors duration-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 active:bg-gray-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">Logout</span>
                </Button>
              </>
            ) : (
              <Link
                href="/signup"
                className="w-full font-medium p-2 rounded-md text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-300"
              >
                Sign In
              </Link>
            )}
          </nav>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Header;
