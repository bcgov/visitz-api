export default () => ({
  recordCache: {
    cacheTtlMs: parseInt(process.env.RECORD_CACHE_MS) || 5 * 60 * 1000, // 5 minutes
  },
  oauth: {
    accessTokenUrl: process.env.ACCESS_TOKEN_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
});
