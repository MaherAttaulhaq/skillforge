// Clear all applications from database
import { db } from "./db";
import { applications } from "./db/schema";

async function clearApplications() {
    console.log("\n🗑️  Clearing all applications from database...\n");

    try {
        await db.delete(applications);
        console.log("✅ All applications cleared!");

        const remaining = await db.select().from(applications).all();
        console.log(`📊 Applications remaining: ${remaining.length}`);
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

clearApplications().catch(console.error);
