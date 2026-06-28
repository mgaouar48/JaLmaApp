const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://xurpdmzleoidqoxaemrb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cnBkbXpsZW9pZHFveGFlbXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjQ5NDEsImV4cCI6MjA4Nzk0MDk0MX0.01BZg2MtJv9b2-IDS7xcwB_KItIQMLHFkjwucw2den0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
    console.log('Creating clean client account (client-test@gmail.com)...');
    const { data: cData, error: cErr } = await supabase.auth.signUp({
        email: 'client-test@gmail.com',
        password: 'password123',
        options: { data: { role: 'client', first_name: 'Client', last_name: 'Test' } }
    });
    console.log(cErr ? cErr.message : 'Client created.');

    console.log('Creating clean driver account (driver-test@gmail.com)...');
    const { data: dData, error: dErr } = await supabase.auth.signUp({
        email: 'driver-test@gmail.com',
        password: 'password123',
        options: { data: { role: 'driver', first_name: 'Driver', last_name: 'Test' } }
    });
    console.log(dErr ? dErr.message : 'Driver auth created.');

    if (dData?.user) {
        // Insert into drivers table just in case
        await supabase.from('drivers').insert({
            id: dData.user.id,
            tank_capacity_liters: 3000,
            price_per_delivery: 1500,
            is_online: false,
            is_available: true,
        }).catch(() => {});
        console.log('Driver row attempted.');
    }
}
run();
