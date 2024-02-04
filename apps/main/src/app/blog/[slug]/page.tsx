/* eslint-disable max-len */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Client } from '@notionhq/client';
import type {
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  DatabaseObjectResponse,
  NumberedListItemBlockObjectResponse
} from '@notionhq/client/build/src/api-endpoints';
import { IconArrowLeft } from '@tabler/icons-react';
import { Button, cn, Code } from '@dealo/ui';
import { formatDate } from '@dealo/helpers';

import { env } from 'env/server.mjs';
import { buildSlug } from 'utils/notion';

const notion = new Client({ auth: env.NOTION_API_KEY });

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { params: { slug } } = props;
  const articleId = slug.split('-').pop();

  if (!articleId) {
    return {};
  }

  const blog: any = await notion.pages.retrieve({
    page_id: articleId,
  });
  const title = blog.properties.Name.title[0].plain_text;

  return {
    title,
    description: blog.properties.tagline.rich_text[0].plain_text,
    keywords: blog.properties.keywords.multi_select.map((tag: any) => tag.name),
  };
}

export async function generateStaticParams() {
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

  return blogs.map((blog) => ({
    slug: buildSlug(blog),
  }))
}

async function processNotionBlocks(blocks: BlockObjectResponse[]) {
  const elements = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i] as BlockObjectResponse;

    if (block.type === 'heading_1') {
      elements.push(
        <h1 key={block.id} className="text-4xl mt-8 mb-8">
          {block.heading_1.rich_text.map((text) => text.plain_text).join('')}
        </h1>
      );
    }

    if (block.type === 'heading_2') {
      elements.push(
        <h2 key={block.id} className="text-3xl mt-8 mb-8">
          {block.heading_2.rich_text.map((text) => text.plain_text).join('')}
        </h2>
      );
    }

    if (block.type === 'heading_3') {
      elements.push(
        <h3 key={block.id} className="text-2xl mt-4 mb-4">
          {block.heading_3.rich_text.map((text) => text.plain_text).join('')}
        </h3>
      );
    }

    if (block.type === 'paragraph') {
      if (block.paragraph.rich_text.length === 0) {
        elements.push(<br key={block.id}/>);
        continue;
      }

      elements.push(
        <p key={block.id} className="mb-2">
          {block.paragraph.rich_text.map((text, index) => {
            if (text.annotations.code) {
              return (
                <code
                  key={`${block.id}-${index}`}
                  className={cn(
                    'bg-emerald-200 dark:bg-emerald-800 rounded-sm px-1',
                    {
                      'font-bold': text.annotations.bold,
                      italic: text.annotations.italic,
                      'line-through': text.annotations.strikethrough,
                      underline: text.annotations.underline,
                    }
                  )}
                >
                  {text.plain_text}
                </code>
              );
            }
            if (text.href) {
              return (
                <a
                  key={`${block.id}-${index}`}
                  href={text.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    'text-emerald-700 dark:text-emerald-300 underline hover:text-emerald-500 dark:hover:text-emerald-400',
                    {
                      'font-bold': text.annotations.bold,
                      italic: text.annotations.italic,
                      'line-through': text.annotations.strikethrough,
                      underline: text.annotations.underline,
                    }
                  )}
                >
                  {text.plain_text}
                </a>
              );
            }
            return text.plain_text;
          })}
        </p>
      );
    }

    if (block.type === 'quote') {
      const quoteChildren = await notion.blocks.children.list({
        block_id: block.id,
      });
      const quoteElements = await processNotionBlocks(quoteChildren.results as BlockObjectResponse[]);
      elements.push(
        <blockquote key={block.id} className="my-6 pl-4 border-l-4 border-emerald-500 dark:border-emerald-700">
          {block.quote.rich_text.map((text) => text.plain_text).join('')}
          {quoteElements}
        </blockquote>
      );
    }

    if (block.type === 'code') {
      elements.push(
        <pre key={block.id} data-el="code-block" className="group p-6 my-6 rounded bg-neutral-50 dark:bg-slate-900 overflow-x-auto">
          <code className="text-sm font-mono py-[1px] px-1 rounded-sm bg-emerald-200 dark:bg-emerald-800 group-data-[el=code-block]:bg-neutral-50 group-data-[el=code-block]:dark:bg-slate-900">
            {block.code.rich_text.map((text) => text.plain_text).join('')}
          </code>
        </pre>
      );
    }

    if (block.type === 'bulleted_list_item') {
      const bulletItems = [block];
      let j = i + 1;
      while (blocks[j] && blocks[j]!.type === 'bulleted_list_item') {
        bulletItems.push(blocks[j]! as BulletedListItemBlockObjectResponse);
        j++;
      }

      i = j - 1;

      elements.push(
        <ul key={block.id} className="list-disc list-outside pl-6 mb-2">
          {bulletItems.map((item) => (
            <li key={item.id}>
              {item.bulleted_list_item.rich_text.map((text) => text.plain_text).join('')}
            </li>
          ))}
        </ul>
      );
    }

    if (block.type === 'numbered_list_item') {
      const bulletItems = [block];
      let j = i + 1;
      while (blocks[j] && blocks[j]!.type === 'numbered_list_item') {
        bulletItems.push(blocks[j]! as NumberedListItemBlockObjectResponse);
        j++;
      }

      i = j - 1;

      elements.push(
        <ol key={block.id} className="list-decimal list-outside pl-6 mb-2">
          {bulletItems.map((item) => (
            <li key={item.id}>
              {item.numbered_list_item.rich_text.map((text) => text.plain_text).join('')}
            </li>
          ))}
        </ol>
      );
    }
  }

  return elements;
}

export default async function BlogDetailPage(props: Props) {
  const { params: { slug } } = props;
  const articleId = slug.split('-').pop();

  if (!articleId) {
    return notFound();
  }

  const page: any = await notion.pages.retrieve({
    page_id: articleId,
  });

  const blocks = [];
  let cursor = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: articleId,
      start_cursor: cursor,
    });
    blocks.push(...response.results);
    cursor = response.next_cursor;
  } while (cursor);

  const elements = await processNotionBlocks(blocks as BlockObjectResponse[]);

  return (
    <main className="max-w-[780px] w-full mx-auto px-4 md:px-0">
      <div className="mb-24">
        <Link href="/blog">
          <Button variant="outline">
            <IconArrowLeft size={14} className="mr-2"/>
            Back to articles
          </Button>
        </Link>
      </div>
      <h1 className="text-5xl mb-6 mt-4">
        {page.properties.Name.title[0].plain_text}
      </h1>
      <div className="flex flex-row gap-2 mb-3">
        {page.properties.keywords.multi_select.map((tag: any) => (
          <Code key={tag.id}>{tag.name}</Code>
        ))}
      </div>
      <p className="mb-24">{formatDate(page.properties.created_at.created_time)}</p>
      {elements}
    </main>
  )
}
