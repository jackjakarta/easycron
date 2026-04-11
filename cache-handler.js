const { createClient } = require('redis');

const client = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

const clientReady = client.connect();

module.exports = {
  async get(cacheKey) {
    try {
      await clientReady;
      const stored = await client.get(cacheKey);
      if (!stored) return undefined;

      const data = JSON.parse(stored);

      return {
        value: new ReadableStream({
          start(controller) {
            controller.enqueue(Buffer.from(data.value, 'base64'));
            controller.close();
          },
        }),
        tags: data.tags,
        stale: data.stale,
        timestamp: data.timestamp,
        expire: data.expire,
        revalidate: data.revalidate,
      };
    } catch (err) {
      console.error('[cache-handler] get error:', err);
      return undefined;
    }
  },

  async set(cacheKey, pendingEntry) {
    try {
      await clientReady;
      const entry = await pendingEntry;

      const reader = entry.value.getReader();
      const chunks = [];

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
      } finally {
        reader.releaseLock();
      }

      const data = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));

      await client.set(
        cacheKey,
        JSON.stringify({
          value: data.toString('base64'),
          tags: entry.tags,
          stale: entry.stale,
          timestamp: entry.timestamp,
          expire: entry.expire,
          revalidate: entry.revalidate,
        }),
        { EX: entry.expire }, // entry.expire is a duration in seconds (Next.js CacheEntry contract)
      );
    } catch (err) {
      console.error('[cache-handler] set error:', err);
    }
  },

  // Tag-based revalidation (revalidateTag()) is not implemented.
  // getExpiration returning 0 is the documented opt-out per the Next.js cache handler interface.
  async refreshTags() {},
  async getExpiration() {
    return 0;
  },
  async updateTags() {},
};
