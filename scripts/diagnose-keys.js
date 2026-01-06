const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(process.cwd(), '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const getVal = (key) => {
    const match = envContent.match(new RegExp(`${key}=(.*)`));
    return match ? match[1].trim() : null;
  };

  const anonKey = getVal('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const serviceKey = getVal('SUPABASE_SERVICE_ROLE_KEY');

  console.log('--- Config Diagnosis ---');
  
  if (!serviceKey) {
    console.log('❌ SUPABASE_SERVICE_ROLE_KEY is MISSING in .env');
  } else if (serviceKey === anonKey) {
    console.log('❌ CRITICAL ERROR: SUPABASE_SERVICE_ROLE_KEY is identical to ANON_KEY!');
    console.log('   You are using the public key as the admin key. This will NOT work.');
  } else if (serviceKey.startsWith('eyJ')) {
     // Decode JWT header to check role
     try {
       const payload = JSON.parse(atob(serviceKey.split('.')[1]));
       if (payload.role === 'service_role') {
         console.log('✅ Service Role Key looks correct (role: service_role).');
       } else {
         console.log(`❌ Invalid Key Role: Found "${payload.role}", expected "service_role"`);
       }
     } catch (e) {
       console.log('⚠️ Could not decode Service Key JWT, but keys are different.');
     }
  } else {
    console.log('⚠️ Service Key format looks unusual (not a standard JWT).');
  }
  
  console.log('------------------------');

} catch (err) {
  console.error('Error reading .env:', err.message);
}
