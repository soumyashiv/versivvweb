// Using Supabase from CDN (script tag in HTML)
// The `supabase` global variable is provided by the CDN script.

const SUPABASE_URL = 'https://sutpnnjswkhzhqtrcess.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dHBubmpzd2toemhxdHJjZXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMDAxMDAsImV4cCI6MjA5MzU3NjEwMH0.Q8t4GuuMV94vLfxekx2Md_jqHRRHj0gTOKqX_3vs6NA';

// Initialize the Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
