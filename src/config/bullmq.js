import { Queue } from "bullmq";
import Redis from "ioredis";

export const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});
connection.on("connect", () => console.log("Redis connected successfully"));
connection.on("error", (err) => console.log("Redis Client Error", err));

export const membershipQueue = new Queue("membership-expiration", {
  connection,
});
