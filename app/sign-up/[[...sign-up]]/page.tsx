import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center">
      <SignUp afterSignOutUrl={"/new-user"} />
    </div>
  );
};

export default SignUpPage;
