# 技术总结文档：QY-Space Blog

## 1. 项目概述
这是一个基于 **Next.js 16 (App Router)** 构建的个人博客/作品集网站。项目采用现代化的前端技术栈，注重性能、设计感和开发体验。集成了内容管理系统（CMS）、身份验证和数据库存储功能。

## 2. 核心技术栈

### 前端框架与语言
- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5.x
- **Runtime**: React 19

### 样式与 UI 系统
- **Styling**: Tailwind CSS v4
  - 使用 CSS 变量定义设计系统 (oklch 色彩空间)
  - 响应式设计
  - 暗黑模式支持
- **Components**: 
  - 基于 Shadcn/ui (Radix UI Primitives)
  - Lucide React (图标库)
- **Animations**: Framer Motion 12 + Motion (声明式动画)

### 数据存储与管理
- **Database**: PostgreSQL
- **ORM**: Prisma 7.2
- **Storage/Backend Services**: Supabase (可能用于存储或作为 Postgres 提供商)
- **Authentication**: Clerk (用于路由保护和身份验证)

### 内容编辑
- **Rich Text Editor**: Tiptap (Headless, Markdown 支持)
  - 集成了 Bubble Menu, Floating Menu
  - 支持 Markdown 导入/导出

## 3. 目录结构分析

```
qy-space/
├── src/
│   ├── app/                 # Next.js App Router 路由
│   │   ├── (public)/        # 公开访问页面 (Blog, About, Home)
│   │   ├── admin/           # 管理后台 (受保护路由)
│   │   ├── api/             # API 路由
│   │   └── globals.css      # 全局样式 & Tailwind 配置
│   ├── components/          # React 组件
│   │   ├── ui/              # 基础 UI 组件 (Button, Input, etc.)
│   │   ├── admin/           # 后台专用组件 (编辑器, 上传等)
│   │   ├── blog/            # 博客展示组件
│   │   └── layout/          # 全局布局 (Header, Footer)
│   ├── lib/                 # 工具函数与核心配置
│   │   ├── actions/         # Server Actions (数据变更与获取)
│   │   ├── db.ts            # Prisma 客户端单例
│   │   └── supabase.ts      # Supabase 客户端配置
│   ├── types/               # TypeScript 类型定义
│   └── middleware.ts        # Clerk 身份验证中间件
├── prisma/                  # 数据库模型定义
│   └── schema.prisma
└── public/                  # 静态资源
```

## 4. 关键功能模块

### 4.1 路由与权限 (Middleware)
- 使用 `clerkMiddleware` 保护 `/admin` 开头的路由。
- 公开路由 `(public)` 对所有用户可见。
- 实现了基于匹配器的路由保护策略。

### 4.2 数据层 (Data Layer)
- **Schema**: 定义了 `Post` (文章) 和 `Category` (分类) 模型。
- **Data Access**: 使用 Next.js Server Actions (`src/lib/actions`) 直接在服务端组件中获取数据，替代传统的 API 路由 fetch 模式。
- **Prisma**: 配置了连接池 (pg connection pool) 以优化 Serverless 环境下的数据库连接。

### 4.3 样式系统 (Theming)
- 采用 **Tailwind CSS v4** 的新特性，直接在 CSS 中通过 `@theme` 指令定义主题变量。
- 使用 `oklch` 色彩空间管理颜色，提供更广阔的色域和更好的感知均匀性。
- 实现了细粒度的圆角 (`radius`) 和图表色系配置。

### 4.4 内容管理 (Admin & Editor)
- 独立的 `/admin` 路径。
- 集成 Tiptap 编辑器，提供类似 Notion 的写作体验。
- 支持封面图上传 (推测使用了 Supabase Storage 或类似服务)。

## 5. 待优化与建议

1.  **Server Actions 错误处理**: 建议在 Server Actions 中统一使用 `try/catch` 并结合 `sonner` 或 `react-hook-form` 返回结构化的错误信息。
2.  **SEO 优化**: 确保每个 `page.tsx` 导出 `metadata` 对象，特别是动态路由 `blog/[slug]`。
3.  **图片优化**: 检查 `next/image` 的 `remotePatterns` 配置，确保允许加载 Supabase 或外部图床的图片。
4.  **构建缓存**: 注意 Prisma Client 在开发环境热重载时的连接数限制 (已在 `db.ts` 中通过全局变量处理)。
