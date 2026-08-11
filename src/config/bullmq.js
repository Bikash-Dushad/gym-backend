import { Queue } from "bullmq";
import Redis from "ioredis";

export const connection = new Redis({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.REDISPORT,
  maxRetriesPerRequest: null,
});

export const membershipQueue = new Queue("membership", {
  connection,
});
