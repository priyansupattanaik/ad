"use client";

import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../assets/siwalogo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const API_IP = process.env.NEXT_PUBLIC_API_IP;
  const BASE_API_URL = `http://${API_IP}:3001`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Both fields are required.");
      return;
    }

    try {
      setErrorMessage("");

      console.log("Sending data:", { username, password });

      const response = await axios.post(`${BASE_API_URL}/`, {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);

        setUsername("");
        setPassword("");

        router.push("/Dashboard/upcomingevents");
      }
    } catch (error: any) {
      console.error("Error:", error);

      if (error.response) {
        setErrorMessage(
          `Error: ${error.response.data.message || "Something went wrong."}`
        );
      } else if (error.message) {
        setErrorMessage(`Network error: ${error.message}`);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gradient-to-r from-green-300 via-green-200 to-white animate-gradient bg-cover bg-fixed">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl">
        <div className="flex justify-center">
          <Image src={logo} alt="Logo" width={200} height={200} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Login
          </button>
          {errorMessage && (
            <p className="text-red-500 text-sm text-center mt-4">
              {errorMessage}
            </p>
          )}
        </form>
      </div>

      <style jsx global>{`
        @keyframes gradientBackground {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          animation: gradientBackground 15s ease infinite;
          background-size: 400% 400%;
        }
      `}</style>
    </div>
  );
};

export default Login;
