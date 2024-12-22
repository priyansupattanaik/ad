"use client";

import React, { useState, useEffect } from "react";
import { FiCalendar, FiMapPin, FiTrash2, FiUpload } from "react-icons/fi";
import { MdAddAPhoto } from "react-icons/md"; // New icon for selecting images

const CompletedEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<{ [key: string]: any[] }>({});

  const API_IP = process.env.NEXT_PUBLIC_API_IP;
  const BASE_API_URL = `http://${API_IP}:3001`;

  useEffect(() => {
    const fetchCompletedEvents = async () => {
      try {
        const response = await fetch(
          `${BASE_API_URL}/api/events/completed-events`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch completed events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedEvents();
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/api/events/delete-completed-event/${eventId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageSelect = (
    eventId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages((prevState) => ({
        ...prevState,
        [eventId]: filesArray,
      }));
    }
  };

  const handleImageUpload = async (eventId: string) => {
    const imagesToUpload = selectedImages[eventId];
    if (!imagesToUpload || imagesToUpload.length === 0) {
      alert("Please select images to upload.");
      return;
    }

    const formData = new FormData();
    imagesToUpload.forEach((image) => {
      formData.append("images", image);
    });

    setUploading(true);
    try {
      const response = await fetch(
        `${BASE_API_URL}/api/events/upload-event-images/${eventId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, images: data.images } : event
        )
      );
      setSelectedImages((prevState) => ({
        ...prevState,
        [eventId]: [], // Clear selected images for this event after upload
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const fetchFeedbacks = async (eventId: string) => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/api/events/feedback/${eventId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }
      const data = await response.json();
      setFeedbacks((prev) => ({ ...prev, [eventId]: data }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide">
          Completed Events
        </h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Completed Events Overview
        </h2>
        <div>
          <p className="text-lg font-medium text-gray-600">
            Total Completed Events
          </p>
          <p className="text-4xl font-extrabold text-blue-700">
            {events.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-600">Loading events...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : events.length > 0 ? (
          events.map((event: any) => (
            <div
              key={event.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:bg-gray-100 hover:shadow-xl transition-shadow duration-300 max-w-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900 truncate">
                  {event.event_title}
                </h3>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-lg text-gray-600 flex items-center">
                  <FiCalendar className="mr-2 text-blue-500" />
                  {event.event_date}
                </p>
                <p className="text-lg text-gray-600 flex items-center">
                  <FiMapPin className="mr-2 text-blue-500" />
                  {event.event_location}
                </p>
              </div>

              {/* Image Select & Upload */}
              <div className="mt-3">
                <label
                  htmlFor={`image-upload-${event.id}`}
                  className="cursor-pointer"
                >
                  <MdAddAPhoto className="w-8 h-8 text-gray-600 hover:text-blue-500" />
                </label>
                <input
                  id={`image-upload-${event.id}`}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageSelect(event.id, e)}
                  className="hidden"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleImageUpload(event.id)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md flex items-center hover:bg-blue-700 disabled:bg-gray-400"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <span className="animate-spin mr-2">Uploading...</span>
                    ) : (
                      <FiUpload className="mr-2" />
                    )}
                    Upload Images
                  </button>
                </div>

                {/* Image Previews */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {selectedImages[event.id]?.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Images from Backend */}
              <div className="mt-4 space-x-4">
                {event.images?.map((image: string) => (
                  <img
                    key={image}
                    src={`${BASE_API_URL}/uploads/${image}`}
                    alt="Event"
                    className="w-24 h-24 rounded-md object-cover"
                  />
                ))}
              </div>

              {/* Feedback Section */}
              <div className="mt-4 bg-gray-100 p-4 rounded-md shadow-inner">
                <h4 className="text-md font-semibold text-gray-800">
                  User Feedback
                </h4>
                <ul className="mt-2 space-y-2">
                  {feedbacks[event.id]?.map((feedback: any, index: number) => (
                    <li key={index} className="p-3 rounded-md bg-white shadow">
                      <p className="text-gray-700">{feedback.feedback}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        - {feedback.user}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md p-2 transition duration-200"
                  aria-label={`Delete ${event.event_title}`}
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No completed events available.</p>
        )}
      </div>
    </div>
  );
};

export default CompletedEvents;
