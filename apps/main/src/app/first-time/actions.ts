'use server'
import { cookies } from 'next/headers';
import { createId } from '@paralleldrive/cuid2';
import { getServerSession } from 'next-auth';
import { Client } from '@notionhq/client';
import { LANDING_PAGE_EXPERIMENT, LANDING_PAGE_EXPERIMENT_COOKIE } from '@dealo/models';

import { env } from 'env/server.mjs';
import { authOptions } from 'utils/auth';
import { recordEvent } from 'utils/analytics';
import { notifyOfCustomerQuery, notifyOfNewSignup } from 'utils/slack';

const notion = new Client({ auth: env.NOTION_API_KEY });

export async function recordSignup() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return;
  }

  const sessionCookies = cookies();
  try {
    await recordEvent({
      id: createId(),
      event: 'signup',
      experiment: LANDING_PAGE_EXPERIMENT,
      variant: sessionCookies.get(LANDING_PAGE_EXPERIMENT_COOKIE)?.value,
    });
    await notifyOfNewSignup({ name: session.user.name!, email: session.user.email! });
    return { success: true };
  } catch (e) {
    console.error('❌ Failed to record signup event', e);
    return { success: false };
  }
}

export interface FirstPageQuery {
  name: string;
  email: string;
  message: string;
}

export async function submitMessage(data: FirstPageQuery) {
  try {
    await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: env.NOTION_QUERY_DATABASE,
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
                content: '--none--',
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
                content: '--first-page--',
              },
            },
          ],
        },
        'Consent': {
          type: 'checkbox',
          checkbox: false,
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

    await notifyOfCustomerQuery({
      name: data.name,
      email: data.email,
    });
    return { success: true };
  } catch (error) {
    console.error('❌ Error posting query to Notion', error);
    return { success: false };
  }
}
