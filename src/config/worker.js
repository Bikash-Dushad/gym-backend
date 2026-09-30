import { Worker } from "bullmq";
import { connection } from "./bullmq";
import { db } from "../db/index.js";
import { membership } from "../db/schema";
import { eq, and } from "drizzle-orm";

const membershipWorker = new Worker(
  "membership-expiration",
  async (job) => {
    const { membershipId, userId } = job.data;
    console.log(`Processing expiration for membership: ${membershipId}`);

    // 1. Update database status
    await db
      .update(membership)
      .set({
        isActive: false,
        isExpired: true,
      })
      .where(
        and(
          eq(membership.id, membershipId),
          eq(membership.isExpired, false), // Guard against double execution
        ),
      );
  },
  { connection },
);

membershipWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully.`);
});

membershipWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err);
});
