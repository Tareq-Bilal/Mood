import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const createNewUser = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const match = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, user.id))
    .limit(1);

  if (!match.length) {
    await db.insert(users).values({
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
    });
  }

  redirect("/journal");
};

const NewUserPage = async () => {
  await createNewUser();

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Setting up your account...</h1>
        <p className="text-gray-400">You&apos;ll be redirected shortly</p>
      </div>
    </div>
  );
};

export default NewUserPage;
