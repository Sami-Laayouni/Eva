import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? process.env.NEXT_PUBLIC_SUPABASE_URL
  : "https://fhbwfjpjrvdmslmjdips.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoYndmanBqcnZkbXNsbWpkaXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ0NzMxNjEsImV4cCI6MjAyMDA0OTE2MX0.dQuKc1I3f-qJARPlAaoPNUUMwuOwIrpJqbH10WFPHbI";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or key is not defined.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
