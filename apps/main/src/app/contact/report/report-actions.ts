'use server';
import { Client } from '@notionhq/client';

import { env } from 'env/server.mjs';
import { notifyOfCustomerReport } from 'utils/slack';

const notion = new Client({ auth: env.NOTION_API_KEY });

export interface Report {
  name: string;
  email: string;
  message: string;
  consent: boolean;
}

export async function postQuery(data: Report) {
  try {
    await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: env.NOTION_REPORT_DATABASE,
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

    await notifyOfCustomerReport({
      name: data.name,
      email: data.email,
    });
    return { success: true };
  } catch (error) {
    console.error('❌ Error posting report to Notion', error);
    return { success: false };
  }
}
