"use client";

import "../globals.css";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { NextAuthProvider } from "@/components/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  useEffect(() => {
    require("preline");
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
