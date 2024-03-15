import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? process.env.NEXT_PUBLIC_SUPABASE_URL
  : "example";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  : "example2";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or key is not defined.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
