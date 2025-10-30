import React from "react";
import Link from "next/link";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-zinc-950 min-h-screen flex">
      <div className="fixed left-0 top-0 h-screen w-20 sm:w-32 text-white bg-zinc-900 border-r flex flex-col items-start justify-start pl-2 sm:pl-4 shadow-md z-10">
        <Link href="/">
          <h1 className="text-xl sm:text-2xl font-bold mt-4">MOOD</h1>
        </Link>
        <ul className="mt-8 flex flex-col pl-0.5 gap-6">
          <Link href="/journal">
            <li className="hover:text-indigo-500 cursor-pointer text-sm sm:text-base">
              Journals
            </li>
          </Link>
          <Link href="/history">
            <li className="hover:text-indigo-500 cursor-pointer text-sm sm:text-base">
              History
            </li>
          </Link>
        </ul>
      </div>
      <div className="ml-22 mr-2 md:ml-30 h-full w-full overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
