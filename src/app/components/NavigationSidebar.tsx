"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePadStore } from "@/store/usePadStore";
import { AiOutlineHome } from "react-icons/ai";
import { FaDrum } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import Image from "next/image";
import SettingSideBar from "../beatmaker/component/SettingSideBar";

export default function NavigationSidebar() {
  const pathname = usePathname();
  const isBeatmaker = pathname === "/beatmaker";
  const { toggleSidebar, isSettingsOpen } = usePadStore();

  {
    /* 사이드바가 열려있을 때와 닫혀있을 때의 스타일을 다르게 적용 */
  }
  return (
    <div
      className={`fixed flex flex-col left-0 top-0 h-full bg-gray-700 p-6 hover:w-60 transition-all duration-300 ${
        isSettingsOpen ? "w-60" : "w-20"
      }`}
    >
      {/* 사이드바 내용 세팅인 내용과 기본 내용 */}
      {!isSettingsOpen ? (
        <>
          <div className="flex items-center mb-6 mt-4">
            <div className="w-8 h-8 flex-shrink-0 mr-2">
              <Image
                src="/Amadeus_logo.png"
                alt="Amadeus Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="overflow-hidden whitespace-nowrap text-white text-lg font-bold">
              Amadeus
            </h2>
          </div>
          <ul className="space-y-4">
            <li className="hover:bg-gray-600 rounded cursor-pointer">
              <Link href="/" className="text-gray-200 flex items-center">
                <AiOutlineHome size={30} className="mr-2 flex-shrink-0" />
                <span className="overflow-hidden whitespace-nowrap">home</span>
              </Link>
            </li>
            <li className="hover:bg-gray-600 rounded cursor-pointer">
              <Link
                href="/beatmaker"
                className="text-gray-200 flex items-center"
              >
                <FaDrum size={30} className="mr-2 flex-shrink-0" />
                <span className="overflow-hidden whitespace-nowrap">
                  beatmaker
                </span>
              </Link>
            </li>
            {isBeatmaker && (
              <li
                onClick={toggleSidebar}
                className="flex items-center text-gray-200 hover:bg-gray-600 rounded cursor-pointer"
              >
                <IoSettingsSharp size={30} className="mr-2 flex-shrink-0" />
                <span className="overflow-hidden whitespace-nowrap">
                  settings
                </span>
              </li>
            )}
          </ul>
        </>
      ) : (
        <SettingSideBar />
      )}
    </div>
  );
}
