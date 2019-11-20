import Redis from "ioredis";
import {RedisPubSub} from "graphql-redis-subscriptions";
import config from "config";

/**
 * Redis configuration.
 */
const options: Redis.RedisOptions = {
    host: config.get('redis_host'),
    port: config.get('redis_port'),
    db: config.get('redis_db'),
    password: config.get('redis_password'),
    retryStrategy: times => Math.max(times * 100, 3000)
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