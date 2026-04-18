import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

console.log(`[SUPABASE] Initializing client with URL: ${supabaseUrl}`);
console.log(`[SUPABASE] Anon key present: ${!!supabaseAnonKey}`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(`[SUPABASE] Missing environment variables:`, {
    VITE_SUPABASE_URL: !!supabaseUrl,
    VITE_SUPABASE_ANON_KEY: !!supabaseAnonKey
  });
  throw new Error("Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log(`[SUPABASE] Client initialized successfully`);
