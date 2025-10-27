import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-[20vh]">
      <div className="flex gap-6 flex-col items-center">
        <h1 className="text-5xl font-bold">
          The Best Journal App Ever, Period.
        </h1>
        <p className="mt-4 text-lg max-w-3xl text-center px-4">
          Mood is a simple, intuitive journal app designed to help you track
          your emotions and reflect on your daily experiences, it just takes
          being honest with yourself.
        </p>
        <button
          className="mt-6
           rounded
            bg-indigo-500
             px-4 py-2
           text-white
            hover:bg-indigo-600
            cursor-pointer
            "
        >
          <Link href="/journal">Get Started</Link>
        </button>
      </div>
    </main>
  );
}
