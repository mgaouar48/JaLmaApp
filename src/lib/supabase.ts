import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../types/supabase';

const SUPABASE_URL = 'https://xurpdmzleoidqoxaemrb.supabase.co';
const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cnBkbXpsZW9pZHFveGFlbXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjQ5NDEsImV4cCI6MjA4Nzk0MDk0MX0.01BZg2MtJv9b2-IDS7xcwB_KItIQMLHFkjwucw2den0';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
