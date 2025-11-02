import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp
        forceRedirectUrl={"/new-user"}
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-zinc-900 text-white",
          },
        }}
      />
    </div>
  );
};

export default SignUpPage;
