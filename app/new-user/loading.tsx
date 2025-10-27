import React from "react";
import { Spinner } from "@/components/ui/spinner";
const loading = () => {
  return (
    <div>
      <h3 className="text-lg font-medium">Creating your account...</h3>
      <Spinner />
    </div>
  );
};

export default loading;
