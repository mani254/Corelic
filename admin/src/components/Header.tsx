"use client"
import { ArrowRight, Globe, House, LayoutGrid, LogOut, Menu, User } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import logo from '../assets/images/logo.png';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && event.target instanceof Node && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const user = {
    name: "Class furniture",
    phone: "8688014415",
    email: "msmanikanta25@gmail.com",
    initial: "C",
  };

  const menuItems = [
    { icon: <LayoutGrid className="w-4 h-4" />, label: "Dashboard" },
    { icon: <Globe className="w-4 h-4" />, label: "View Website" }
  ];



  const mobileMenuItems = [
    { icon: <House className="w-4 h-4" />, label: "Home" },
    ...menuItems,
    { icon: <User className="w-4 h-4" />, label: "Profile" },
  ];

  const handleSignout = useCallback(() => {
    console.log('handle sign out')
  }, [])

  return (
    <header className="shadow-sm shadow-orange-100 bg-white sticky top-0">
      {/* Logo */}
      <div className="container w-full flex items-center justify-between py-2">
        <div className="flex items-center">
          <Image
            src={logo}
            alt="Logo"
            className="h-9 w-9 -mt-1 mr-2 rounded"
            width="200"
            height="200"
          />
          <h2 className="text-2xl font-semibold">
            <span className="text-primary-500">Co</span>rlelic
          </h2>
        </div>

        {/* Profile Menu Toggle */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full border border-gray-300 p-2 flex items-center gap-2 focus:outline-none cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <div className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-semibold text-sm">
              {user.initial}
            </div>
          </button>

          {/* Dropdown for Desktop */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg z-50 hidden sm:block min-w-[300px]">
              <div className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="absolute p-1 rounded-full w-6 h-6 text-gray-700 bg-gray-50 hover:bg-gray-100 -rotate-45 right-6 top-10  flex items-center justify-center cursor-pointer"><ArrowRight /></div>
                  <div className="bg-primary-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                    {user.initial}
                  </div>
                  <div className="space-y-[2px]">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.phone}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>

              <ul className="space-y-1 py-1 border-b border-gray-200">
                {menuItems.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 text-sm flex text-gray-700 items-center gap-3 cursor-pointer py-[10px] hover:bg-gray-50 rounded-md"
                  >
                    {item.icon} <p>{item.label}</p>
                  </li>
                ))}
              </ul>
              <div className="my-2 px-4 text-sm flex text-gray-700 items-center gap-3 cursor-pointer py-[10px]  hover:bg-gray-50 hover:text-red-500 rounded-md" onClick={handleSignout}>
                <LogOut className="w-4 h-4" /> Sign Out
              </div>
            </div>

          )}
        </div>

        {/* Slide Menu for Mobile */}
        <div className={`fixed top-0 left-0 h-full bg-white w-72 z-50 py-4  transform transition-transform duration-300 ease-in-out sm:hidden shadow-lg ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          {/* <div className="flex items-center justify-between mb-6"> */}

          <button onClick={() => setIsOpen(false)} className="border border-gray-200 rounded-full w-7 h-7 flex items-center justify-center text-2xl absolute top-1 right-2 text-gray-700 cursor-pointer">×</button>
          {/* </div> */}
          <div className="flex items-center jusitify-center flex-col gap-2 border-b border-gray-200 pb-4">
            <div className="bg-primary-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
              {user.initial}
            </div>
            <div className="space-y-[2px]">
              <p className="font-medium text-center">{user.name}</p>
              <p className="text-sm text-gray-500 text-center">{user.phone}</p>
              <p className="text-sm text-gray-500 text-center">{user.email}</p>
            </div>
          </div>
          <ul className="space-y-1 py-1 border-b border-gray-100">
            {mobileMenuItems.map((item, index) => (
              <li
                key={index}
                className="px-4 text-sm flex text-gray-700 items-center gap-3 cursor-pointer py-[10px] hover:bg-gray-50 rounded-md"
              >
                {item.icon} <p>{item.label}</p>
              </li>
            ))}
          </ul>
          <div className="my-2 px-4 text-sm flex text-gray-700 items-center gap-3 cursor-pointer py-[10px]  hover:bg-gray-50 hover:text-red-500 rounded-md" onClick={handleSignout}>
            <LogOut className="w-4 h-4" /> Sign Out
          </div>
        </div>
      </div>

    </header>
  );
}

// Make sure you have installed Lucide icons
// npm install lucide-react
