const { CacheHandler } = require('@neshca/cache-handler');
const { createClient } = require('redis');

CacheHandler.onCreation(async () => {
  const client = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
  });

  await client.connect();

  return {
    handlers: [require('@neshca/cache-handler/redis-strings').default(client)],
  };
});

module.exports = CacheHandler;
