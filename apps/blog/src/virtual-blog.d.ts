declare module "virtual:blog-posts" {
  export const posts: Array<{
    slug: string;
    title: string;
    description: string;
    date: string;
    updated?: string;
    tags: string[];
    draft: boolean;
    cover?: string;
    html: string;
    toc: Array<{ id: string; text: string; depth: 2 | 3 }>;
    readingMinutes: number;
  }>;
}
