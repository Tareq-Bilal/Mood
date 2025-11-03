import React from "react";
import { Spinner } from "@/components/ui/spinner";
const loading = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <Spinner className="size-8 text-indigo-500" />
      <p className="text-gray-400 mt-4">Loading journals...</p>
    </div>
  );
};
export default loading;
