import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://mymchnefxfxroelzdrsz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bWNobmVmeGZ4cm9lbHpkcnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMTA3MTgsImV4cCI6MjA1NTg4NjcxOH0.y_MeXeOHyZ6ja76tAS_j9a3oXyg8Aloq-D86RefmzXI";

export const supabase = createClient(supabaseUrl, supabaseKey);
