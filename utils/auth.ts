import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUserByClerkId = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated.");
  }

  const user = (
    await db.select().from(users).where(eq(users.clerkId, userId)).limit(1)
  )[0];

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};
