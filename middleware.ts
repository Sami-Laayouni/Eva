// Import necessary modules from Supabase and Next.js
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

// Import necessary types from Next.js and your custom types
import type { NextRequest } from "next/server";
import type { Database } from "@/lib/supabase.types";

// Define a middleware function that handles Supabase authentication
export async function middleware(req: NextRequest) {
  // Create a Next.js response object
  const res = NextResponse.next();

  // Create a Supabase client using the middleware helper function
  const supabase = createMiddlewareClient<Database>({ req, res });

  // Retrieve the user's session from Supabase
  await supabase.auth.getSession();

  // Return the Next.js response
  return res;
}
