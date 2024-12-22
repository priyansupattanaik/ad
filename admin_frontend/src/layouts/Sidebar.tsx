"use client";

import { usePathname } from "next/navigation";
import {
  FiCalendar,
  FiCheckCircle,
  FiPlusCircle,
  FiBell,
  FiUser,
} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/siwalogo.png";

const nav = [
  {
    id: 1,
    title: "Upcoming Events",
    paths: ["/Dashboard/upcomingevents", "/", "/Dashboard"],
    icon: <FiCalendar size={24} />,
  },
  {
    id: 2,
    title: "Completed Events",
    paths: ["/Dashboard/completedevents"],
    icon: <FiCheckCircle size={24} />,
  },
  {
    id: 3,
    title: "Add Events",
    paths: ["/Dashboard/addevents"],
    icon: <FiPlusCircle size={24} />,
  },
  {
    id: 4,
    title: "Notifications",
    paths: ["/Dashboard/notifications"],
    icon: <FiBell size={24} />,
  },
  {
    id: 5,
    title: "Profile",
    paths: ["/Dashboard/profile"],
    icon: <FiUser size={24} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-md z-50">
      <div className="flex justify-center items-center py-6 border-b">
        <Image src={logo} alt="SIWA Logo" width={150} height={150} />
      </div>

      <nav className="mt-6 px-4">
        {nav.map((item) => {
          const isActive = item.paths.some((path) => pathname === path);
          return (
            <Link key={item.id} href={item.paths[0]}>
              <button
                className={`flex items-center space-x-4 p-3 rounded-lg w-full text-left text-gray-700 transition-colors duration-200 ${
                  isActive ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="text-md font-medium">{item.title}</span>
              </button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
