// Quick script to check applications in the database
import { db } from "./db";
import { applications, users, jobs } from "./db/schema";
import { eq } from "drizzle-orm";

async function checkApplications() {
    console.log("\n📋 Checking Applications in Database...\n");

    const allApplications = await db.select({
        userId: applications.userId,
        jobId: applications.jobId,
        appliedAt: applications.appliedAt,
        userName: users.name,
        userEmail: users.email,
        jobTitle: jobs.title,
        company: jobs.company,
    })
        .from(applications)
        .leftJoin(users, eq(applications.userId, users.id))
        .leftJoin(jobs, eq(applications.jobId, jobs.id))
        .all();

    if (allApplications.length === 0) {
        console.log("❌ No applications found in the database.\n");
    } else {
        console.log(`✅ Found ${allApplications.length} application(s):\n`);
        allApplications.forEach((app, index) => {
            console.log(`${index + 1}. ${app.userName} (${app.userEmail})`);
            console.log(`   Applied to: ${app.jobTitle} at ${app.company}`);
            console.log(`   Job ID: ${app.jobId} | User ID: ${app.userId}`);
            console.log(`   Applied at: ${app.appliedAt}\n`);
        });
    }
}

checkApplications().catch(console.error);
