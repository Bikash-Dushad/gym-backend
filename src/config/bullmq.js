import { Queue } from "bullmq";
import Redis from "ioredis";

export const connection = new Redis({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

export const membershipQueue = new Queue("membership", {
  connection,
});
