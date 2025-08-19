import type { Metadata } from "next";
import NavigationSidebar from "./components/NavigationSidebar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Amadeus",
  description: "Beat-making toy project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex ">
        <div className="flex">
          <NavigationSidebar />
        </div>
        <main className="flex-1 flex flex-col items-center justify-center  bg-[#1e1e1e]">
          {children}
        </main>
      </body>
    </html>
  );
}
