// js/config.js

export const SUPABASE_URL = "https://pmbxyfketmuzocepllvf.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYnh5ZmtldG11em9jZXBsbHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3ODE4NjUsImV4cCI6MjA3MzM1Nzg2NX0.oh9zssayvCPp-jcCohQugTx28Ds2Ts-y7Tbp-pgX1XE";

// Exportamos la instancia única lista para usarse en cualquier vista
export const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);
