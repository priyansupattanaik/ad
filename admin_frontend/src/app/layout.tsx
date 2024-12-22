"use client";

import { usePathname } from "next/navigation";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/layouts/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/";

  return (
    <html lang="en">
      <body>
        {!isLoginPage && <Sidebar />}
        {children}
      </body>
    </html>
  );
}
