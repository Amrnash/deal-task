import { Property } from "../models/property";
import cron from "node-cron";

cron.schedule("0 0 */3 * *", async () => {
  const now = new Date();
  try {
    await Property.updateMany({}, { refreshedAt: now });
    console.log("Successfully updated refreshedAt for all documents");
  } catch (error) {
    console.error("Error updating refreshedAt:", error);
  }
});
