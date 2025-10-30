import React from "react";
import Link from "next/link";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-zinc-950 min-h-screen flex">
      <div className="fixed left-0 top-0 h-screen w-32 text-white bg-zinc-900 border-r flex flex-col items-start justify-start pl-4 shadow-md z-10">
        <Link href="/">
          <h1 className="text-2xl font-bold mt-4">MOOD</h1>
        </Link>
        <ul className="mt-8 flex flex-col pl-0.5 gap-6">
          <Link href="/journal">
            <li className="hover:text-indigo-500 cursor-pointer">Journals</li>
          </Link>
          <li className="hover:text-indigo-500 cursor-pointer">History</li>
        </ul>
      </div>
      <div className="ml-34 h-full w-full overflow-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
