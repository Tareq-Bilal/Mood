import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateContent = (text: string, maxLength: number = 150) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
