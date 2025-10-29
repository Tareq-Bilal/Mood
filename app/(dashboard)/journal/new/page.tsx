import React from "react";
import Editor from "@/components/Editor";

const NewJournalPage = () => {
  return (
    <div className="text-white w-full h-screen grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <Editor />
      </div>
      <div className="border-l border-indigo-500 h-full">
        <h1
          className="text-2xl py-4 flex justify-center text-white font-semibold"
          style={{ backgroundColor: "#6366f1" }}
        >
          Analysis
        </h1>
        <div className="p-4 text-center text-gray-400">
          <p className="text-sm">
            Analysis will appear here after you save your entry...
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewJournalPage;
