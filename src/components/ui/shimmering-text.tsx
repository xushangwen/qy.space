"use client";

import { cn } from "@/lib/utils";

interface ShimmeringTextProps {
  text: string;
  className?: string;
  shimmerBy?: "text" | "background";
}

export const ShimmeringText = ({
  text,
  className,
  shimmerBy = "text",
}: ShimmeringTextProps) => {
  return (
    <span
      className={cn(
        // 修改点 1: 渐变逻辑调整
        // 不再使用 transparent，而是全部使用变量控制
        // 范围从 40%/60% 放宽到 35%/65% 甚至更宽，让光边缘更羽化
        "relative inline-block bg-[linear-gradient(90deg,var(--shimmer-dim)_0%,var(--shimmer-dim)_40%,var(--shimmer-bright)_50%,var(--shimmer-dim)_65%,var(--shimmer-dim)_100%)] bg-[length:200%_100%] bg-clip-text text-transparent transition-all",
        shimmerBy === "text" && "animate-shimmer",
        className
      )}
      style={
        {
          // 修改点 2: 调整颜色混合逻辑 (关键)
          
          // --shimmer-dim (暗部/常态): 
          // 之前是透明，现在改成 50% 的前景色。
          // 如果觉得还是太暗，把 50% 改成 60% 或 70%。
          "--shimmer-dim": "color-mix(in srgb, var(--foreground) 60%, transparent)",
          
          // --shimmer-bright (高光/扫过时):
          // 保持 100% 前景色，或者稍微加一点白色让它更亮
          "--shimmer-bright": "var(--foreground)",
          
          "--shimmer-duration": "3s", // 稍微调快一点点，配合柔和的过渡会更像呼吸
        } as React.CSSProperties
      }
    >
      {text}
    </span>
  );
};