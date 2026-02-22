import { db } from "./db";
import { applications, users, jobs } from "./db/schema";
import { eq, and } from "drizzle-orm";

async function testApplication() {
  console.log("\n🧪 Testing Application Insert...\n");

  try {
    // First, get the first user and first job
    const firstUser = await db.select().from(users).limit(1).get();
    const firstJob = await db.select().from(jobs).limit(1).get();

    if (!firstUser) {
      console.error(
        "❌ No users found in database. Please seed the database first.",
      );
      return;
    }

    if (!firstJob) {
      console.error(
        "❌ No jobs found in database. Please seed the database first.",
      );
      return;
    }

    console.log(`✅ Found user: ${firstUser.name} (ID: ${firstUser.id})`);
    console.log(`✅ Found job: ${firstJob.title} (ID: ${firstJob.id})`);

    // Try to insert an application
    console.log("\n📝 Attempting to insert application...");

    const result = await db.insert(applications).values({
      userId: firstUser.id,
      jobId: firstJob.id,
    });

    console.log("✅ Application inserted successfully!");
    console.log("Result:", result);

    // Verify the insert
    const inserted = await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.userId, firstUser.id),
          eq(applications.jobId, firstJob.id),
        ),
      )
      .get();

    if (inserted) {
      console.log("\n✅ Verified! Application found in database:");
      console.log({
        userId: inserted.userId,
        jobId: inserted.jobId,
        appliedAt: inserted.appliedAt,
      });
    } else {
      console.log("\n❌ Could not verify - application not found after insert");
    }

    // Show all applications
    const allApps = await db.select().from(applications).all();
    console.log(`\n📊 Total applications in database: ${allApps.length}`);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testApplication().catch(console.error);
