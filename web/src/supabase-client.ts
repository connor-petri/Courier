import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const supabase: SupabaseClient = createClient(
    process.env.REACT_APP_SUPABASE_URL!, 
    process.env.REACT_APP_SUPABASE_ANON_KEY!
);