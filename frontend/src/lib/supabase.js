import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let supabase;

if (supabaseUrl && supabaseUrl.startsWith("http")) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a mock client for build time / when credentials aren't set
  console.warn(
    "⚠️ Supabase credentials not configured. Using mock client."
  );
  const noOp = () => ({ data: null, error: { message: "Supabase not configured" } });
  const noOpAuth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: noOp,
    signUp: noOp,
    signOut: async () => ({}),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getUser: noOp,
  };
  supabase = {
    auth: noOpAuth,
    from: () => ({
      select: () => ({ eq: () => ({ eq: () => ({ order: () => ({ limit: () => ({ data: [], error: null }) }) }), data: [], error: null, count: 0 }), order: () => ({ data: [], error: null }), data: [], error: null, count: 0 }),
      insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }), data: null, error: null }),
      update: () => ({ eq: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }) }) }),
      delete: () => ({ eq: () => ({ eq: () => ({ data: null, error: null }), data: null, error: null }) }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
        remove: async () => ({ error: null }),
      }),
    },
  };
}

export { supabase };
