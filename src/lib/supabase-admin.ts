import { createClient } from "@supabase/supabase-js";

// 注意：这里必须使用 SERVICE_ROLE_KEY，不能是 ANON_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 安全检查：防止误用 Anon Key
if (supabaseServiceRoleKey && supabaseServiceRoleKey === supabaseAnonKey) {
  console.error("\n\n❌ [CRITICAL CONFIG ERROR] ---------------------------------------------------");
  console.error("SUPABASE_SERVICE_ROLE_KEY 与 NEXT_PUBLIC_SUPABASE_ANON_KEY 相同！");
  console.error("请务必使用 'service_role' (secret) key，否则后端无法绕过 RLS 权限限制。");
  console.error("----------------------------------------------------------------------------\n\n");
}

// 如果没有配置 Service Role Key，创建一个空的客户端防止构建报错
// 但实际运行时会需要这个 Key
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
