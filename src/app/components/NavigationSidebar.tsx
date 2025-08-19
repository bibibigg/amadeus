"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePadStore } from "@/store/usePadStore";

export default function NavigationSidebar() {
  const pathname = usePathname();
  const isBeatmaker = pathname === "/beatmaker";
  const { toggleSidebar } = usePadStore();
  return (
    <div className="flex flex-col left-0 top-0 h-full w-100 max-w-xs bg-gray-700 shadow-lg p-6 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Amadeus</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/" className="text-blue-500 hover:underline">
            home
          </Link>
        </li>
        <li>
          <Link href="/beatmaker" className="text-blue-500 hover:underline">
            beatmaker
          </Link>
        </li>
        {isBeatmaker && (
          <li onClick={toggleSidebar} className="text-blue-500 hover:underline">
            settings
          </li>
        )}
      </ul>
    </div>
  );
}
