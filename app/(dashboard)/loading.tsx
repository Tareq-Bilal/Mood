import React from "react";
import { Spinner } from "@/components/ui/spinner";
const loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner className="size-8 text-indigo-500" />
    </div>
  );
};
export default loading;
