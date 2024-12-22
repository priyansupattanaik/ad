"use client";
import AddEvents from "./Dashboard/addevents/page";
import CompletedEvents from "./Dashboard/completedevents/page";
import Notifications from "./Dashboard/notifications/page";
import Profile from "./Dashboard/profile/page";
import UpcomingEvents from "./Dashboard/upcomingevents/page";
import Login from "./Login/page";

export default function components() {
  return (
    <>
      <Login />
      {/* <UpcomingEvents />
      <CompletedEvents />
      <AddEvents />
      <Notifications />
      <Profile /> */}
    </>
  );
}
