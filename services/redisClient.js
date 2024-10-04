const redis = require('redis');

// Create a Redis client
const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redisClient;