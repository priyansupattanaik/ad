"use client";

import { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiInfo, FiMapPin } from "react-icons/fi";

const apiIp = process.env.NEXT_PUBLIC_API_IP; // Fetch IP from environment variable
const port = "3001";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbacks, setFeedbacks] = useState<{ [key: string]: any[] }>({});

  const baseUrl = `http://${apiIp}:${port}`;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/events/all-events`);
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const fetchFeedbacks = async (eventId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/events/feedback/${eventId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }
      const data = await response.json();
      setFeedbacks((prev) => ({ ...prev, [eventId]: data }));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMarkAsCompleted = async (eventId: string) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/events/complete-event/${eventId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark event as completed");
      }

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, status: "completed" } : event
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide">
          Upcoming Events
        </h1>
      </div>

      {/* Events Overview Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Events Overview
        </h2>
        <div>
          <p className="text-lg font-medium text-gray-600">
            Total Upcoming Events
          </p>
          <p className="text-4xl font-extrabold text-blue-700">
            {events.filter((event) => event.status === "upcoming").length}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Upcoming Events List
        </h2>
        {loading ? (
          <p className="text-gray-600">Loading events...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : events.length > 0 ? (
          <div className="space-y-6">
            {events
              .filter((event) => event.status === "upcoming")
              .map((event: any) => (
                <div
                  key={event.id}
                  className="flex items-start p-4 border rounded-lg shadow-lg bg-white hover:bg-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Event Image */}
                  <img
                    src={`${baseUrl}/uploads/${event.event_image}`}
                    alt={event.event_title}
                    className="w-40 h-40 rounded-md object-cover mr-6"
                  />

                  {/* Event Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {event.event_title}
                    </h3>
                    <p className="text-lg text-gray-600 flex items-center mb-1">
                      <FiCalendar className="mr-2 text-blue-500" />{" "}
                      <span>{event.event_date}</span>
                    </p>
                    <p className="text-lg text-gray-600 flex items-center mb-1">
                      <FiClock className="mr-2 text-blue-500" />{" "}
                      <span>{event.event_time}</span>
                    </p>
                    <p className="text-lg text-gray-600 flex items-start mb-1">
                      <FiInfo className="mr-2 text-blue-500 mt-1" />{" "}
                      <span>{event.event_description}</span>
                    </p>
                    <p className="text-lg text-gray-600 flex items-start mb-2">
                      <FiMapPin className="mr-2 text-blue-500 mt-1" />{" "}
                      <span>{event.event_location}</span>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4">
                      <button
                        onClick={() => handleMarkAsCompleted(event.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition duration-300"
                      >
                        Mark as Completed
                      </button>
                      <button
                        onClick={() => fetchFeedbacks(event.id)}
                        className="bg-gray-100 text-blue-600 hover:bg-gray-200 px-5 py-2 rounded-lg transition duration-300"
                      >
                        View Feedback
                      </button>
                    </div>

                    {/* Feedback Section */}
                    {feedbacks[event.id] && (
                      <div className="mt-4 bg-gray-100 p-4 rounded-md shadow-inner">
                        <h4 className="text-md font-semibold text-gray-800">
                          User Feedback
                        </h4>
                        <ul className="mt-2 space-y-2">
                          {feedbacks[event.id].map(
                            (feedback: any, index: number) => (
                              <li
                                key={index}
                                className="p-3 rounded-md bg-white shadow"
                              >
                                <p className="text-gray-700">
                                  {feedback.feedback}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  - {feedback.user}
                                </p>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-600">No events available.</p>
        )}
      </div>
    </div>
  );
}
