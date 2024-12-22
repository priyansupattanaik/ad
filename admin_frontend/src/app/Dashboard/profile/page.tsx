"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

export default function Profile() {
  const router = useRouter();

  const handleLogout = () => {
    console.log("User logged out");
    router.push("/");
  };

  return (
    <div className="ml-64 p-6 bg-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-6 mb-6">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
            />
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
              <span className="text-sm">Edit</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Admin</h2>

            <p className="text-gray-500 text-sm">Administrator</p>
          </div>
        </div>

        {/* Logout Button */}
        <div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
