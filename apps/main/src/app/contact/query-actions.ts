'use server';
import { Client } from '@notionhq/client';

import { env } from 'env/server.mjs';

const notion = new Client({ auth: env.NOTION_API_KEY });

export interface Query {
  name: string;
  email: string;
  company: string;
  source: string;
  message: string;
  consent: boolean;
}

export async function postQuery(data: Query) {
  await notion.pages.create({
    parent: {
      type: 'database_id',
      database_id: env.NOTION_DATABASE_ID,
    },
    properties: {
      'Name': {
        type: 'title',
        title: [
          {
            type: 'text',
            text: {
              content: data.name,
            },
          },
        ],
      },
      'Email': {
        type: 'email',
        email: data.email,
      },
      'Company': {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: {
              content: data.company,
            },
          },
        ],
      },
      'Source': {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: {
              content: data.source,
            },
          },
        ],
      },
      'Consent': {
        type: 'checkbox',
        checkbox: data.consent,
      },
    },
    children: [
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: data.message,
              },
            },
          ],
        },
      },
    ],
  });
}
