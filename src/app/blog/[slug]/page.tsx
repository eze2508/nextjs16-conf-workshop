import { getBlogPostBySlug, getFeaturedBlogPosts } from "@/api";
import { cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { getBlogPosts } from "@/api";
import BlogPosts from "@/components/blog-posts";
import { Suspense } from "react";
import { BlogPostsSkeleton } from "@/components/blog-posts";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({slug: post.slug}));
}

async function getCachedBlogPostBySlug(slug: string) {
  "use cache";

  cacheTag(slug);
  const post = await getBlogPostBySlug(slug);

  return post;
}

async function FeaturedPosts() {
  const featuredPosts = await getFeaturedBlogPosts();
  return <BlogPosts posts={featuredPosts} />;
}

export default async function BlogPostPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  return (
  <main className="container mx-auto flex flex-col gap-8 px-4 py-8">
      <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
      <p className="text-muted-foreground">{post.content}</p>
      <hr />
      <Suspense fallback={<BlogPostsSkeleton />}>
        <FeaturedPosts />
      </Suspense>
  </main>
  );
}