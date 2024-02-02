/* eslint-disable max-len */
import { Client } from '@notionhq/client';
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { cn } from '@dealo/ui';

import { env } from 'env/server.mjs';

const notion = new Client({ auth: env.NOTION_API_KEY });

// const ARTICLE_LIST_ID = '7cd0d638f20c45c6a0b73df60ac0a303';
const INTEGRATION_ARTICLE_ID = 'a5932473fb1849dc8bc8e544303df35f';

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
      elements.push(
        <li key={block.id}>
          {block.bulleted_list_item.rich_text.map((text) => text.plain_text).join('')}
        </li>
      );
    }

    if (block.type === 'numbered_list_item') {
      elements.push(
        <li key={block.id}>
          {block.numbered_list_item.rich_text.map((text) => text.plain_text).join('')}
        </li>
      );
    }
  }

  return elements;
}

export default async function NotionTest() {
  const page = await notion.pages.retrieve({
    page_id: INTEGRATION_ARTICLE_ID,
  });

  const blocks = [];
  let cursor = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: INTEGRATION_ARTICLE_ID,
      start_cursor: cursor,
    });
    blocks.push(...response.results);
    cursor = response.next_cursor;
  } while (cursor);

  const elements = await processNotionBlocks(blocks as BlockObjectResponse[]);

  return (
    <>
      <h1 className="text-5xl my-24">
        {(page as any).properties.Name.title[0].plain_text}
      </h1>
      {/*<pre>{JSON.stringify(page, null, 2)}</pre>*/}
      <div className="max-w-[700px]">
        {elements}
      </div>
    </>
  )
}
