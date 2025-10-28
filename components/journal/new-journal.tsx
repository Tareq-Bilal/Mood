"use client";
import { createNewEntry } from "@/utils/api";
import { useRouter } from "next/navigation";
const NewJournal = () => {
  const router = useRouter();

  const handleOnCLick = async () => {
    const entry = await createNewEntry();
    router.push(`/journal/${entry.id}`);
  };

  return (
    <div
      className="w-full h-full min-h-64 bg-zinc-800 rounded-lg p-8 flex items-center justify-center cursor-pointer hover:bg-zinc-700 hover:shadow-lg transition-all duration-200 border border-zinc-700 hover:border-indigo-500"
      onClick={handleOnCLick}
    >
      <span className="text-2xl md:text-3xl font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
        + New Entry
      </span>
    </div>
  );
};

export default NewJournal;
