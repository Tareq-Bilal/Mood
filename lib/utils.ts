import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateContent = (text: string, maxLength: number = 150) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// compute streak: consecutive days with at least one entry counting backwards from latest entry
export function computeStreak(entries: Array<{ updatedAt: Date | string }>) {
  if (!entries || entries.length === 0) return 0;
  // entries should be ordered by updatedAt desc
  let streak = 0;
  let lastDate: Date | null = null;
  for (const e of entries) {
    const d = new Date(e.updatedAt);
    const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (!lastDate) {
      streak = 1;
      lastDate = dateOnly;
      continue;
    }
    const diff = Math.floor(
      (lastDate.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) {
      // same day, continue
      continue;
    } else if (diff === 1) {
      streak += 1;
      lastDate = dateOnly;
    } else {
      break;
    }
  }
  return streak;
}
