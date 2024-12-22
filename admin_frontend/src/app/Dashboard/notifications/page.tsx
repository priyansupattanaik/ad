"use client";

import React, { useState, useEffect } from "react";
import { FiMessageSquare, FiTrash2 } from "react-icons/fi";

interface Suggestion {
  id: number;
  name: string;
  suggestion: string;
  timestamp: string;
}

export default function Notifications() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_IP = process.env.NEXT_PUBLIC_API_IP;
  const BASE_API_URL = `http://${API_IP}:5001`;

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        console.log("Fetching suggestions...");
        const response = await fetch(`${BASE_API_URL}/api/suggestions`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch suggestions: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Fetched suggestions:", data);
        setSuggestions(data);
      } catch (err: any) {
        console.error("Error fetching suggestions:", err);
        setError("Failed to fetch suggestions");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${diffInDays} days ago`;
  };

  const deleteSuggestion = async (id: number) => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/suggestions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete suggestion: ${response.statusText}`);
      }

      // Remove the deleted suggestion from the state
      setSuggestions((prevSuggestions) =>
        prevSuggestions.filter((suggestion) => suggestion.id !== id)
      );
    } catch (err: any) {
      console.error("Error deleting suggestion:", err);
      setError("Failed to delete suggestion");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <div className="mb-10">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Suggestions & Feedback
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        {suggestions.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageSquare className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              No suggestions available
            </h3>
            <p className="mt-2 text-md text-gray-500">
              There are no suggestions at the moment. Check back later!
            </p>
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="border-b last:border-b-0 p-6 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {suggestion.name}
                      </h2>
                      <p className="text-gray-600 mt-1 text-lg">
                        {suggestion.suggestion}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 mt-2">
                        {formatTimeAgo(suggestion.timestamp)}
                      </span>
                      <button
                        onClick={() => deleteSuggestion(suggestion.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
