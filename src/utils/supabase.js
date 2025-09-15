import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uwomtohnfoauaqdotjjg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3b210b2huZm9hdWFxZG90ampnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2OTI1OTEsImV4cCI6MjA3MDI2ODU5MX0.7fe80mpDiKz58KxCXNtw9CMWgUD2pUudNS9wIzG0Trc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);