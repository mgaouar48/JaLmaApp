const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://xurpdmzleoidqoxaemrb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cnBkbXpsZW9pZHFveGFlbXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjQ5NDEsImV4cCI6MjA4Nzk0MDk0MX0.01BZg2MtJv9b2-IDS7xcwB_KItIQMLHFkjwucw2den0';

const clientSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const driverSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
    try {
        console.log('1. Logging in client (client-test@gmail.com)...');
        const { data: clientAuth, error: clientAuthErr } = await clientSupabase.auth.signInWithPassword({
            email: 'client-test@gmail.com',
            password: 'password123',
        });
        if (clientAuthErr) {
            console.error('Client authentication failed:', clientAuthErr.message);
            return;
        }
        console.log('Client authenticated successfully! User ID:', clientAuth.user.id);

        console.log('\n2. Logging in driver (driver-test@gmail.com)...');
        const { data: driverAuth, error: driverAuthErr } = await driverSupabase.auth.signInWithPassword({
            email: 'driver-test@gmail.com',
            password: 'password123',
        });
        if (driverAuthErr) {
            console.error('Driver authentication failed:', driverAuthErr.message);
            return;
        }
        console.log('Driver authenticated successfully! User ID:', driverAuth.user.id);

        // Make driver online and available
        console.log('\n3. Resetting driver status to online & available...');
        const { error: driverUpdateErr } = await driverSupabase
            .from('drivers')
            .update({ is_online: true, is_available: true })
            .eq('id', driverAuth.user.id);
        if (driverUpdateErr) {
            console.error('Failed to reset driver status:', driverUpdateErr.message);
            return;
        }
        console.log('Driver is online and available.');

        // Call create-order as the client
        console.log('\n4. Invoking create-order Edge Function...');
        const { data: orderData, error: orderErr } = await clientSupabase.functions.invoke('create-order', {
            headers: {
                Authorization: `Bearer ${clientAuth.session.access_token}`,
            },
            body: {
                delivery_lat: 36.1911,
                delivery_lon: 1.3324,
                delivery_address: 'Verification Test Address',
                quantity_liters: 1000,
                estimated_price: 1500,
            },
        });

        if (orderErr) {
            console.error('create-order Edge Function returned error:', orderErr);
            return;
        }
        console.log('create-order Edge Function response:', orderData);
        const orderId = orderData.order_id;

        // Fetch the order row
        console.log('\n5. Fetching order status from DB...');
        const { data: orderDb, error: orderDbErr } = await clientSupabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
        if (orderDbErr) {
            console.error('Failed to fetch order from DB:', orderDbErr.message);
            return;
        }
        console.log('Order created in DB:', {
            id: orderDb.id,
            status: orderDb.status,
            client_id: orderDb.client_id,
            driver_id: orderDb.driver_id,
        });

        // Let's test the driver accepting the order if it was assigned to them
        if (orderDb.driver_id === driverAuth.user.id) {
            console.log('\n6. Order was assigned to our test driver! Invoking accept-order...');
            const { data: acceptData, error: acceptErr } = await driverSupabase.functions.invoke('accept-order', {
                headers: {
                    Authorization: `Bearer ${driverAuth.session.access_token}`,
                },
                body: {
                    order_id: orderId,
                },
            });
            if (acceptErr) {
                console.error('accept-order Edge Function returned error:', acceptErr);
            } else {
                console.log('accept-order Edge Function response:', acceptData);
            }
        } else {
            console.log('\n6. Order was not assigned to our test driver. Assigned driver ID:', orderDb.driver_id);
        }
    } catch (e) {
        console.error('Unexpected error during test execution:', e);
    }
}

run();
