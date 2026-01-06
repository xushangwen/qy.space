export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
  category?: Category | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  posts?: Post[];
}
