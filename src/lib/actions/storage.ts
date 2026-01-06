"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function uploadImage(formData: FormData) {
  console.log("[Upload Action] Starting upload process...");

  // 1. 验证用户是否登录
  const { userId } = await auth();
  if (!userId) {
    console.error("[Upload Action] Unauthorized: No userId found");
    return { error: "Unauthorized: 请先登录" };
  }

  // 2. 获取并验证配置
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("[Upload Action] Missing Config:", { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!serviceKey 
    });
    return { error: "Server Configuration Error: 环境变量缺失" };
  }

  // 检查 Key 类型 (简单检查 JWT payload)
  try {
    const [, payload] = serviceKey.split('.');
    if (payload) {
      const decoded = JSON.parse(atob(payload));
      console.log(`[Upload Action] Key Role: ${decoded.role}`);
      if (decoded.role !== 'service_role') {
        console.error("[Upload Action] CRITICAL: Key role is NOT service_role!");
        return { error: "Server Configuration Error: Key 权限不足" };
      }
    }
  } catch (e) {
    console.warn("[Upload Action] Could not decode key:", e);
  }

  // 3. 创建一次性 Admin Client (确保拥有最高权限)
  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  // 4. 生成文件名
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `covers/${fileName}`;

  try {
    // 5. 将 File 转换为 ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 6. 上传
    console.log(`[Upload Action] Uploading to ${filePath}...`);
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from("blog-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[Upload Action] Supabase Upload Error:", uploadError);
      return { error: `Upload failed: ${uploadError.message}` };
    }

    // 7. 获取公开 URL
    const { data } = supabaseAdmin
      .storage
      .from("blog-images")
      .getPublicUrl(filePath);

    console.log(`[Upload Action] Success! URL: ${data.publicUrl}`);
    return { url: data.publicUrl };

  } catch (err) {
    console.error("[Upload Action] System Error:", err);
    return { error: "Internal Server Error during upload" };
  }
}
