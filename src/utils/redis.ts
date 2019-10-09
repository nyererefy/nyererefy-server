import Redis from "ioredis";
import {RedisPubSub} from "graphql-redis-subscriptions";
import config from "config";
import {REDIS_DB, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT} from "./consts";

/**
 * Redis configuration.
 */
const options: Redis.RedisOptions = {
    host: config.get(REDIS_HOST),
    port: config.get(REDIS_PORT),
    db: config.get(REDIS_DB),
    password: config.get(REDIS_PASSWORD),
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