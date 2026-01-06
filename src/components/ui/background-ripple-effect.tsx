"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface BackgroundRippleEffectProps {
  className?: string;
  cellClassName?: string;
  rows?: number;
  cols?: number;
  cellSize?: number;
  hoverColor?: string;
  rippleColor?: string;
  gridColor?: string;
}

export const BackgroundRippleEffect = ({
  className,
  cellClassName,
  rows = 35,
  cols = 50,
  cellSize = 56,
  hoverColor = "var(--primary)",
  rippleColor = "var(--primary)",
  gridColor = "border-border/50",
}: BackgroundRippleEffectProps) => {
  const [clickedCell, setClickedCell] = useState<[number, number] | null>(null);

  // 垂直遮罩：顶部 30% 可见，底部逐渐透明
  const verticalMask = "linear-gradient(to bottom, black 30%, transparent 95%)";

  // 水平遮罩：左右两侧渐隐
  const horizontalMask = "linear-gradient(to right, transparent 5%, black 20%, black 80%, transparent 95%)";

  return (
    <div
      className={cn(
        "absolute inset-0 z-0 grid overflow-hidden",
        "justify-center",
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${cols}, min-content)`,
        maskImage: `${verticalMask}, ${horizontalMask}`,
        WebkitMaskImage: `${verticalMask}, ${horizontalMask}`,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => (
          <Cell
            key={`${row}-${col}`}
            row={row}
            col={col}
            className={cellClassName}
            clickedCell={clickedCell}
            setClickedCell={setClickedCell}
            hoverColor={hoverColor}
            rippleColor={rippleColor}
            gridColor={gridColor}
          />
        ))
      )}
    </div>
  );
};

const Cell = ({
  row,
  col,
  className,
  clickedCell,
  setClickedCell,
  hoverColor,
  rippleColor,
  gridColor,
}: {
  row: number;
  col: number;
  className?: string;
  clickedCell: [number, number] | null;
  setClickedCell: (cell: [number, number] | null) => void;
  hoverColor: string;
  rippleColor: string;
  gridColor: string;
}) => {
  const controls = useAnimation();

  useEffect(() => {
    if (clickedCell) {
      const [clickedRow, clickedCol] = clickedCell;
      const distance = Math.sqrt(
        Math.pow(clickedRow - row, 2) + Math.pow(clickedCol - col, 2)
      );
      
      const delay = distance * 0.035;

      controls.start({
        opacity: [0, 0.5, 0], // 调整透明度峰值，让描边更明显
        scale: [1, 3, 1], // 缩放保持
        backgroundColor: rippleColor,
        // 【修改点 2：涟漪描边】
        // 在动画过程中加入 borderColor 的变化，或者让它一直保持高亮
        borderColor: "rgba(255, 255, 255, 0.5)", 
        borderWidth: "0.5px",
        transition: { 
          duration: 0.6, 
          delay: delay,
          ease: "easeOut" 
        },
      });
    }
  }, [clickedCell, row, col, controls, rippleColor]);

  return (
    <div
      className={cn(
        "relative border-r-[0.6px] border-b-[0.6px] transition-colors cursor-pointer",
        "h-12 w-12",
        "overflow-hidden", 
        className
      )}
      style={{
        borderColor: gridColor.includes("border") ? undefined : gridColor, 
      }}
      onClick={() => setClickedCell([row, col])}
    >
      {/* 【修改点 1：悬停描边】 */}
      {/* 这里添加了一个 inset-0 的 div 专门处理 Hover。
         hover:border 和 hover:border-white/10 实现了“略微白一点”的边框。
         注意：border 默认是 inset 的，不会撑大容器。
      */}
      <div 
        className="absolute inset-0 transition-all duration-200 hover:bg-primary/10 hover:border-[0.6px] hover:border-white/20"
      />
      
      {/* Ripple 动画层 */}
      <motion.div
        animate={controls}
        initial={{ opacity: 0 }}
        // 给 motion.div 初始加上 border 样式，虽然初始 opacity 是 0
        className="absolute inset-0 pointer-events-none border-0 border-white/0"
        style={{ 
          backgroundColor: rippleColor,
          // 这里通过 style 也可以设置初始边框颜色，但主要由 animate 控制
        }}
      />
    </div>
  );
};
