import { Worker } from "bullmq";
import { connection } from "../config/bullmq.js";
import { db } from "../db/index.js";
import { membership } from "../db/schema/membership.schema.js";
import { eq } from "drizzle-orm";

const worker = new Worker(
  "membership",
  async (job) => {
    const { membershipId } = job.data;
    if (!membershipId) {
      throw new Error("Job payload missing required membershipId.");
    }

    const [targetMembership] = await db
      .select()
      .from(membership)
      .where(eq(membership.id, membershipId))
      .limit(1);

    if (!targetMembership) {
      console.log("Membership doesnot exists");
    }

    await db
      .update(membership)
      .set({
        isActive: false,
        isExpired: true,
      })
      .where(eq(membership.id, membershipId));

    console.log(`[Successfully expired membership ${membershipId}`);
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log("job completed", job.id, job.name, job.data);
});

worker.on("failed", (job, error) => {
  console.log("job failed", job.id, job.name, job.data, error);
});
