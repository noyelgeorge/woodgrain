/* Wood & Grains — Supabase connection settings.
   Fill these in with the values from Project Settings -> API in your Supabase dashboard.
   The anon key is safe to expose in a public site — it only allows what your table
   permissions (Row Level Security policies) say it can do. */
const SUPABASE_URL = 'https://loldnwoqhpccmfmebrdx.supabase.co';       // e.g. https://abcdefgh.supabase.co
const SUPABASE_ANON_KEY = ,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvbGRud29xaHBjY21mbWVicmR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMjM2MzUsImV4cCI6MjEwMjY5OTYzNX0.v-uX14asvDsaCq55olca0oRQsRHhVpCwT6dTHF3b11Q';

/* A simple deterrent password for the /admin.html page.
   NOTE: this is NOT real security — anyone who reads the page source can see it.
   It just stops casual visitors from finding /admin.html and messing with your products.
   Change it to whatever you like. */
const ADMIN_PASSWORD = 'changeme123';
