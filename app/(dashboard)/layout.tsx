"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, Notebook, History, Bookmark, X } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-zinc-950 min-h-screen flex">
      {/* Desktop Sidebar - visible on lg and above */}
      <div className="hidden lg:fixed lg:flex lg:left-0 lg:top-0 lg:h-screen lg:w-36 text-white bg-zinc-900 border-r flex-col items-start justify-start pl-4 shadow-md z-10">
        <Link href="/">
          <h1 className="text-2xl font-bold mt-4">MOOD</h1>
        </Link>
        <ul className="mt-8 flex flex-col pl-0.5 gap-6">
          <Link href="/journal">
            <li className="hover:text-indigo-500 cursor-pointer text-base">
              <Notebook className="inline mr-2 size-5 mb-1" />
              Journals
            </li>
          </Link>
          <Link href="/history">
            <li className="hover:text-indigo-500 cursor-pointer text-base">
              <History className="inline mr-2 size-5 mb-1" />
              History
            </li>
          </Link>
          <Link href="/bookmarks">
            <li className="hover:text-indigo-500 cursor-pointer text-base">
              <Bookmark className="inline mr-2 size-5 mb-1" />
              Bookmarks
            </li>
          </Link>
        </ul>
      </div>

      {/* Mobile/Tablet Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-700 flex items-center justify-between px-4 z-50">
        <Link href="/">
          <h1 className="text-xl font-bold text-white">MOOD</h1>
        </Link>
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-indigo-500 transition-colors"
        >
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile/Tablet Sidebar - hamburger menu */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed left-0 top-16 h-[calc(100vh-64px)] w-64 text-white bg-zinc-900 border-r border-zinc-700 flex flex-col items-start justify-start pl-4 shadow-md z-40">
          <ul className="mt-8 flex flex-col pl-0.5 gap-6 w-full">
            <Link href="/journal" onClick={() => setIsSidebarOpen(false)}>
              <li className="hover:text-indigo-500 cursor-pointer text-base">
                Journals
              </li>
            </Link>
            <Link href="/history" onClick={() => setIsSidebarOpen(false)}>
              <li className="hover:text-indigo-500 cursor-pointer text-base">
                History
              </li>
            </Link>
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full lg:ml-32 mt-16 lg:mt-0 h-[calc(100vh-64px)] lg:h-screen overflow-auto px-3">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
