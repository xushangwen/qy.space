"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { uploadImage } from "@/lib/actions/storage";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("请上传图片文件");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("图片大小不能超过 5MB");
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadImage(formData);

        if (result.error) {
          throw new Error(result.error);
        }

        if (result.url) {
          onChange(result.url);
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError(err instanceof Error ? err.message : "上传失败，请检查网络或配置");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange("");
  }, [onChange]);

  if (value) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted group">
        <img
          src={value}
          alt="封面图片"
          className="h-full w-full object-cover pointer-events-none select-none"
        />
        <button
          type="button"
          className="absolute right-2 top-2 z-50 h-8 w-8 rounded-md bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90 flex items-center justify-center pointer-events-auto cursor-pointer"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
      }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="absolute inset-0 cursor-pointer opacity-0"
        disabled={isUploading}
      />

      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">上传中...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          {isDragging ? (
            <Upload className="h-8 w-8 text-primary" />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium">
              {isDragging ? "释放以上传" : "拖拽图片到这里"}
            </p>
            <p className="text-xs text-muted-foreground">
              或点击选择文件 (最大 5MB)
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="absolute bottom-2 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
