import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="fixed left-0 top-0 h-screen w-32 text-white bg-zinc-900 border-r flex flex-col items-start justify-start pl-4 shadow-md z-10">
        <h1 className="text-2xl font-bold mt-4">MOOD</h1>
        <ul className="mt-8 flex flex-col pl-0.5 gap-6">
          <li className="hover:text-indigo-500 cursor-pointer">Journals</li>
          <li className="hover:text-indigo-500 cursor-pointer">Settings</li>
        </ul>
      </div>
      <div className="pt-16 h-full overflow-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
