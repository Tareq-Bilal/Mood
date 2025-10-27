import React from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const createNewUser = async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const match = await db.select().from(users).where(eq(users.clerkId, user.id));

  if (!match.length) {
    const newUser = await db
      .insert(users)
      .values({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
      })
      .returning();
    return newUser[0];
  }

  redirect("/journal");
};
const NewUserPage = async () => {
  await createNewUser();
  return <div>Loading...</div>;
};

export default NewUserPage;
