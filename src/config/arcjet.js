import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';

const aj = arcjet({
  // Get your site key from https://app.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: process.env.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: 'LIVE' }),
    // Create a bot detection rule
    detectBot({
      mode: 'LIVE', // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        'CATEGORY:SEARCH_ENGINE', // Google, Bing, etc for SEO
        'CATEGORY:PREVIEW', // Link previews e.g. Slack, Discord
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
      ],
    }),
    // Rate limit rule - max 5 requests per 2 seconds
    slidingWindow({
      mode: 'LIVE', // Enforce rate limits. Use "DRY_RUN" to log only
      interval: '2s', // Time window
      max: 5, // Max requests allowed within time window
    }),
  ],
});

export default aj;
