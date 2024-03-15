// Import necessary modules for class manipulation
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Define a utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  // Merge classes using clsx and tailwind-merge
  // clsx is used to combine multiple class names into a single string
  // twMerge is used to merge Tailwind CSS classes while handling conditional classes
  return twMerge(clsx(inputs));
}
