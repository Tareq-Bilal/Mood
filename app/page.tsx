import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  const href = userId ? "/journal" : "/sign-in";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-[10vh] sm:pt-[15vh] md:pt-[20vh] px-4 sm:px-6 lg:px-8">
      <div className="flex gap-4 sm:gap-4 flex-col items-center w-full max-w-5xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight">
          The Best Journal App Ever, Period.
        </h1>
        <p className="mt-2 sm:mt-4 text-base sm:text-lg md:text-xl max-w-3xl text-center px-4">
          Mood is a simple, intuitive journal app designed to help you track
          your emotions and reflect on your daily experiences, it just takes
          being honest with yourself.
        </p>
        <button className="mt-4 sm:mt-6 rounded-xl bg-indigo-500 px-4 sm:px-4 py-2.5 sm:py-3 text-base sm:text-md text-white hover:bg-indigo-600 cursor-pointer transition-colors duration-200">
          <Link href={href}>Get Started</Link>
        </button>
      </div>
    </main>
  );
}
