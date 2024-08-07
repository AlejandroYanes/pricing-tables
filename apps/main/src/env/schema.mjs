// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  POSTGRES_URL: z.string().url(),
  POSTGRES_PRISMA_URL: z.string().url(),
  POSTGRES_URL_NO_SSL: z.string().url(),
  POSTGRES_URL_NON_POOLING: z.string().url(),
  POSTGRES_USER: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth.js automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string() : z.string().url(),
  ),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  // Slack channels
  SLACK_USERS_CHANNEL: z.string(),
  SLACK_SUBSCRIPTIONS_CHANNEL: z.string(),
  SLACK_INVOICES_CHANNEL: z.string(),
  SLACK_EMAILS_CHANNEL: z.string(),
  SLACK_CUSTOMERS_CHANNEL: z.string(),
  // Stripe keys
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_CONNECT_WEBHOOK_SECRET: z.string(),
  STRIPE_CHECKOUT_WEBHOOK_SECRET: z.string(),
  STRIPE_SUBSCRIPTION_WEBHOOK_SECRET: z.string(),
  STRIPE_INVOICE_WEBHOOK_SECRET: z.string(),
  STRIPE_DEALO_ACCOUNT: z.string(),
  // Platform URL
  PLATFORM_URL: z.string().url().nullish(),
  // Resend
  RESEND_API_KEY: z.string(),
  // Notion
  NOTION_API_KEY: z.string(),
  NOTION_QUERY_DATABASE: z.string(),
  NOTION_REPORT_DATABASE: z.string(),
  NOTION_BLOG_DATABASE: z.string(),
  // Vercel
  VERCEL_TEAM_ID: z.string(),
  VERCEL_API_TOKEN: z.string(),
  EDGE_CONFIG: z.string(),
  EDGE_CONFIG_ID: z.string(),
  EDGE_CONFIG_TOKEN: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js
 * middleware, so you have to do it manually here.
 * @type {{ [k in keyof z.infer<typeof serverSchema>]: z.infer<typeof serverSchema>[k] | undefined }}
 */
export const serverEnv = {
  NODE_ENV: process.env.NODE_ENV,
  POSTGRES_URL: process.env.POSTGRES_URL,
  POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
  POSTGRES_URL_NO_SSL: process.env.POSTGRES_URL_NO_SSL,
  POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  // Discord
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  // Google
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  // Github
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  // Slack channels
  SLACK_USERS_CHANNEL: process.env.SLACK_USERS_CHANNEL,
  SLACK_SUBSCRIPTIONS_CHANNEL: process.env.SLACK_SUBSCRIPTIONS_CHANNEL,
  SLACK_INVOICES_CHANNEL: process.env.SLACK_INVOICES_CHANNEL,
  SLACK_EMAILS_CHANNEL: process.env.SLACK_EMAILS_CHANNEL,
  SLACK_CUSTOMERS_CHANNEL: process.env.SLACK_CUSTOMERS_CHANNEL,
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_CONNECT_WEBHOOK_SECRET: process.env.STRIPE_CONNECT_WEBHOOK_SECRET,
  STRIPE_CHECKOUT_WEBHOOK_SECRET: process.env.STRIPE_CHECKOUT_WEBHOOK_SECRET,
  STRIPE_SUBSCRIPTION_WEBHOOK_SECRET: process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET,
  STRIPE_INVOICE_WEBHOOK_SECRET: process.env.STRIPE_INVOICE_WEBHOOK_SECRET,
  STRIPE_DEALO_ACCOUNT: process.env.STRIPE_DEALO_ACCOUNT,
  // Platform
  PLATFORM_URL: process.env.PLATFORM_URL,
  // Resend
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  // Notion
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_QUERY_DATABASE: process.env.NOTION_QUERY_DATABASE,
  NOTION_REPORT_DATABASE: process.env.NOTION_REPORT_DATABASE,
  NOTION_BLOG_DATABASE: process.env.NOTION_BLOG_DATABASE,
  // Vercel
  VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
  VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN,
  EDGE_CONFIG: process.env.EDGE_CONFIG,
  EDGE_CONFIG_ID: process.env.EDGE_CONFIG_ID,
  EDGE_CONFIG_TOKEN: process.env.EDGE_CONFIG_TOKEN,
};

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  // NEXT_PUBLIC_CLIENTVAR: z.string(),
  NEXT_PUBLIC_PLATFORM_URL: z.string().url().nullish(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  NEXT_PUBLIC_PLATFORM_URL: process.env.NEXT_PUBLIC_PLATFORM_URL,
};
