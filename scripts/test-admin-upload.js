const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. 手动读取 .env 文件
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const getVal = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getVal('NEXT_PUBLIC_SUPABASE_URL');
const serviceKey = getVal('SUPABASE_SERVICE_ROLE_KEY');

console.log('--- Testing Admin Upload ---');
console.log('URL:', supabaseUrl);
console.log('Key (first 10 chars):', serviceKey ? serviceKey.substring(0, 10) + '...' : 'MISSING');

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing Config!');
  process.exit(1);
}

// 2. 初始化 Admin 客户端
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function test() {
  const fileName = `test-upload-${Date.now()}.txt`;
  
  // 3. 尝试上传
  console.log(`\nAttempting to upload "${fileName}" to bucket "blog-images"...`);
  
  const { data, error } = await supabase
    .storage
    .from('blog-images')
    .upload(fileName, 'Hello from Admin Test Script', {
      contentType: 'text/plain',
      upsert: true
    });

  if (error) {
    console.error('❌ Upload Failed:', error);
    
    // 尝试列出 Buckets，检查权限
    console.log('\nChecking Bucket List permission...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.error('❌ List Buckets Failed:', bucketError);
    } else {
      console.log('✅ Buckets found:', buckets.map(b => b.name));
      const hasBucket = buckets.some(b => b.name === 'blog-images');
      if (!hasBucket) {
        console.error('❌ Bucket "blog-images" does NOT exist!');
      }
    }
  } else {
    console.log('✅ Upload Successful!');
    console.log('Path:', data.path);
    
    // 清理测试文件
    await supabase.storage.from('blog-images').remove([fileName]);
    console.log('✅ Test file cleaned up.');
  }
}

test();
