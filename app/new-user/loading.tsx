import React from "react";
import { Spinner } from "@/components/ui/spinner";
const loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h3 className="text-lg font-medium">Creating your account...</h3>
      <Spinner />
    </div>
  );
};

export default loading;
