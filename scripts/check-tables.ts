import { db } from "@/utils/db";
import { sql } from "drizzle-orm";

async function checkTables() {
  try {
    // Query to check if sentiment_scores table exists
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log("Tables in database:");
    console.log(result.rows);

    // Check if sentiment_scores exists
    const sentimentScoresExists = result.rows.some(
      (row: any) => row.table_name === "sentiment_scores"
    );

    if (sentimentScoresExists) {
      console.log("\n✓ sentiment_scores table exists!");
    } else {
      console.log("\n✗ sentiment_scores table does NOT exist!");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error checking tables:", error);
    process.exit(1);
  }
}

checkTables();
