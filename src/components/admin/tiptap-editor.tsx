"use client";

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import React, { useEffect } from "react";
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  Minus,
  RemoveFormatting
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/actions/storage";
import { toast } from "sonner";

interface TiptapEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  className?: string;
}

export function TiptapEditor({ initialContent = "", onChange, className }: TiptapEditorProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg border border-border",
        },
      }),
      Placeholder.configure({
        placeholder: "输入 '/' 唤起命令菜单，选中文字唤起格式菜单...",
      }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-4",
          "prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
          "prose-p:my-4 prose-p:leading-7",
          "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
          "prose-pre:bg-muted prose-pre:text-foreground prose-pre:border prose-pre:border-border",
          "prose-code:bg-muted/50 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
          "prose-img:rounded-lg prose-img:border prose-img:border-border",
          "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic",
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      // 获取 Markdown 内容
      const markdown = editor.storage.markdown.getMarkdown();
      onChange(markdown);
    },
  });

  // 监听 initialContent 变化 (用于加载异步数据)
  useEffect(() => {
    if (editor && initialContent && editor.storage.markdown.getMarkdown() !== initialContent) {
      // 只在内容差异较大且编辑器没有焦点时更新，防止输入时跳动
      // 这里简化处理：如果是初始化加载（编辑器内容为空），则设置
      if (editor.getText() === "" && initialContent) {
         editor.commands.setContent(initialContent);
      }
    }
  }, [initialContent, editor]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("请上传图片文件");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("图片大小不能超过 5MB");
      return;
    }

    const toastId = toast.loading("正在上传图片...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadImage(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.url && editor) {
        editor.chain().focus().setImage({ src: result.url }).run();
        toast.success("图片上传成功", { id: toastId });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(error instanceof Error ? error.message : "图片上传失败", { id: toastId });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="relative w-full rounded-lg border border-input bg-background shadow-sm">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
      {/* Fixed Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-2">
        <Button
          size="icon"
          variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="h-8 w-8"
          type="button"
          title="一级标题"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-8 w-8"
          type="button"
          title="二级标题"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="h-8 w-8"
          type="button"
          title="三级标题"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        
        <div className="mx-1 h-6 w-px bg-border" />
        
        <Button
          size="icon"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8"
          type="button"
          title="加粗"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8"
          type="button"
          title="斜体"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="h-8 w-8"
          type="button"
          title="删除线"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("code") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleCode().run()}
          className="h-8 w-8"
          type="button"
          title="行内代码"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        <Button
          size="icon"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8"
          type="button"
          title="无序列表"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8"
          type="button"
          title="有序列表"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8"
          type="button"
          title="引用"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="h-8 w-8"
          type="button"
          title="分割线"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        <Button
          size="icon"
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          onClick={setLink}
          className="h-8 w-8"
          type="button"
          title="链接"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={triggerImageUpload}
          className="h-8 w-8"
          type="button"
          title="插入图片"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="h-8 w-8"
          type="button"
          title="清除格式"
        >
          <RemoveFormatting className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8"
          type="button"
          title="撤销"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8"
          type="button"
          title="重做"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Bubble Menu - 选中文字时显示 */}
      {editor && (
        <BubbleMenu 
          editor={editor} 
          tippyOptions={{ duration: 100 }}
          className="flex items-center gap-1 rounded-md border border-border bg-popover p-1 shadow-md"
        >
          <Button
            size="icon"
            variant={editor.isActive("bold") ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-8 w-8"
            type="button"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={editor.isActive("italic") ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-8 w-8"
            type="button"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={editor.isActive("strike") ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="h-8 w-8"
            type="button"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={editor.isActive("code") ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleCode().run()}
            className="h-8 w-8"
            type="button"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={editor.isActive("link") ? "secondary" : "ghost"}
            onClick={setLink}
            className="h-8 w-8"
            type="button"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}

      {/* Floating Menu - 空行显示 */}
      {editor && (
        <FloatingMenu 
          editor={editor} 
          tippyOptions={{ duration: 100 }}
          className="flex items-center gap-1 rounded-md border border-border bg-popover p-1 shadow-md"
        >
          <Button
            size="icon"
            variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="h-8 w-8"
            type="button"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="h-8 w-8"
            type="button"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
           <Button
            size="icon"
            variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className="h-8 w-8"
            type="button"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-8 w-8"
            type="button"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-8 w-8"
            type="button"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className="h-8 w-8"
            type="button"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={triggerImageUpload}
            className="h-8 w-8"
            type="button"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </FloatingMenu>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
