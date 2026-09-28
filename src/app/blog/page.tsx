import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts } from "@/lib/content";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/blog");

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="space-y-6">
      <Breadcrumbs path="/blog" />
      <header className="space-y-3">
        <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Blog
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-700">
          Essays and notes on tarot, astrology, and reflective tools, written
          for people who like nuance more than predictions.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => {
          const fm = post.frontmatter;
          return (
            <Card key={post.slug} className="flex flex-col gap-4 sm:flex-row">
              <div className="relative h-24 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-32 sm:w-40">
                <Image
                  src={(fm as any).image}
                  alt={fm.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <CardHeader className="mb-2">
                  <CardTitle>{fm.title}</CardTitle>
                  <CardDescription>{fm.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    {new Date(fm.date).toLocaleDateString()}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
                  >
                    Read
                  </Link>
                </CardFooter>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

