import Link from 'next/link';
import { Client } from '@notionhq/client';
import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { cn, Code } from '@dealo/ui';
import { formatDate } from '@dealo/helpers';

import { env } from 'env/server.mjs';
import { buildSlug } from 'utils/notion';

const notion = new Client({ auth: env.NOTION_API_KEY });

export default async function RootBlogPage() {
  const blogs = (
    await notion.databases.query({
      database_id: env.NOTION_BLOG_DATABASE,
      filter: {
        property: 'status',
        status: {
          equals: 'Done'
        }
      },
      sorts: [
        {
          property: 'created_at',
          direction: 'ascending',
        },
      ],
    })
  ).results as DatabaseObjectResponse[];

  return (
    <main className="max-w-[980px] mx-auto">
      <h1 className="text-5xl my-24">Blog</h1>
      <div className="grid grid-cols-2 gap-24">
        {blogs.map((blog: any) => (
          <Link key={blog.id} href={`/blog/${(buildSlug(blog))}`}>
            <div
              key={blog.id}
              className={cn(
                'flex flex-col p-6 h-full rounded border border-neutral-100 dark:border-slate-800',
                'hover:border-emerald-600 dark:hover:border-emerald-500 transition-border duration-200',
              )}
            >
              <h2 className="text-2xl">{blog.properties.Name?.title[0].plain_text}</h2>
              <div className="flex flex-row gap-2 mt-1">
                {blog.properties.keywords.multi_select.map((tag: any) => (
                  <Code key={tag.id}>{tag.name}</Code>
                ))}
              </div>
              <span className="mt-2 mb-4">{formatDate(blog.properties.created_at.created_time)}</span>
              <p className="text-neutral-600 dark:text-neutral-300">{blog.properties.tagline.rich_text[0].plain_text}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
