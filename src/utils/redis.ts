import Redis from "ioredis";
import {RedisPubSub} from "graphql-redis-subscriptions";

// configure Redis connection options
const options: Redis.RedisOptions = {
    host: "127.0.0.1", // replace with own IP
    port: 6379,
    retryStrategy: times => Math.max(times * 100, 3000),
    db: 1
};

/**
 * Used for session storage.
 */
export const redis = new Redis(options);

/**
 * For subscriptions.
 */
export const pubSub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
});