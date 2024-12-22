"use client";

import React, { useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiAlertCircle,
  FiImage,
} from "react-icons/fi";

function AddEvents() {
  const [eventTitle, setEventTitle] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [eventTime, setEventTime] = useState<string>("");
  const [eventLocation, setEventLocation] = useState<string>("");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!eventTitle.trim()) newErrors.eventTitle = "Event title is required";
    if (!eventDescription.trim())
      newErrors.eventDescription = "Event description is required";
    if (!eventDate) newErrors.eventDate = "Event date is required";
    if (!eventTime) newErrors.eventTime = "Event time is required";
    if (!eventLocation.trim())
      newErrors.eventLocation = "Event location is required";
    if (!eventImage) newErrors.eventImage = "Event image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      formData.append("eventTitle", eventTitle);
      formData.append("eventDescription", eventDescription);
      formData.append("eventDate", eventDate);
      formData.append("eventTime", eventTime);
      formData.append("eventLocation", eventLocation);

      const API_IP = process.env.NEXT_PUBLIC_API_IP;
      const BASE_API_URL = `http://${API_IP}:3001`;

      if (eventImage) formData.append("eventImage", eventImage);

      try {
        const response = await fetch(`${BASE_API_URL}/api/events/add-event`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          alert("Event created successfully!");
        } else {
          const error = await response.text();
          alert(`Error: ${error}`);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred while submitting the event.");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEventImage(e.target.files[0]);
    }
  };

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide">
          Add New Event
        </h1>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Event Creation Overview
        </h2>
        <p className="text-gray-600">Create a new event.</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Event Title */}
          <div>
            <label
              htmlFor="event-title"
              className="block text-sm font-semibold text-gray-800"
            >
              Event Title
            </label>
            <input
              type="text"
              id="event-title"
              name="event-title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className={`mt-2 block w-full px-4 py-3 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm ${
                errors.eventTitle ? "border-red-500" : "border-gray-300"
              }`}
              aria-invalid={errors.eventTitle ? "true" : "false"}
            />
            {errors.eventTitle && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="inline mr-2" />
                {errors.eventTitle}
              </p>
            )}
          </div>

          {/* Event Description */}
          <div>
            <label
              htmlFor="event-description"
              className="block text-sm font-semibold text-gray-800"
            >
              Description
            </label>
            <textarea
              id="event-description"
              name="event-description"
              rows={4}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              className={`mt-2 block w-full px-4 py-3 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm ${
                errors.eventDescription ? "border-red-500" : "border-gray-300"
              }`}
              aria-invalid={errors.eventDescription ? "true" : "false"}
            />
            {errors.eventDescription && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="inline mr-2" />
                {errors.eventDescription}
              </p>
            )}
          </div>

          {/* Event Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Event Date */}
            <div>
              <label
                htmlFor="event-date"
                className="block text-sm font-semibold text-gray-800"
              >
                Date
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="event-date"
                  name="event-date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className={`block w-full pl-10 px-4 py-3 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm ${
                    errors.eventDate ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={errors.eventDate ? "true" : "false"}
                />
              </div>
              {errors.eventDate && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="inline mr-2" />
                  {errors.eventDate}
                </p>
              )}
            </div>

            {/* Event Time */}
            <div>
              <label
                htmlFor="event-time"
                className="block text-sm font-semibold text-gray-800"
              >
                Time
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiClock className="text-gray-400" />
                </div>
                <input
                  type="time"
                  id="event-time"
                  name="event-time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className={`block w-full pl-10 px-4 py-3 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm ${
                    errors.eventTime ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={errors.eventTime ? "true" : "false"}
                />
              </div>
              {errors.eventTime && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="inline mr-2" />
                  {errors.eventTime}
                </p>
              )}
            </div>
          </div>

          {/* Event Location */}
          <div>
            <label
              htmlFor="event-location"
              className="block text-sm font-semibold text-gray-800"
            >
              Location
            </label>
            <div className="mt-2 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="text-gray-400" />
              </div>
              <input
                type="text"
                id="event-location"
                name="event-location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className={`block w-full pl-10 px-4 py-3 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm ${
                  errors.eventLocation ? "border-red-500" : "border-gray-300"
                }`}
                aria-invalid={errors.eventLocation ? "true" : "false"}
              />
            </div>
            {errors.eventLocation && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="inline mr-2" />
                {errors.eventLocation}
              </p>
            )}
          </div>

          {/* Event Image */}
          <div>
            <label
              htmlFor="event-image"
              className="block text-sm font-semibold text-gray-800"
            >
              Event Image
            </label>
            <input
              type="file"
              id="event-image"
              name="event-image"
              onChange={handleImageChange}
              className="mt-2 block w-full px-4 py-3 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm"
            />
            {errors.eventImage && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="inline mr-2" />
                {errors.eventImage}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-8 inline-block w-full py-3 px-6 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEvents;
