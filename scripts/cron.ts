import Logger from "../class/Logger";
import SinoTrade from "../class/SinoTrade";

// Main execution function
async function executeTask() {
  try {
    Logger.info("Starting SinoTrade task execution");
    await SinoTrade.main();
    Logger.success("Task completed successfully");
  } catch (error) {
    Logger.error(`Task failed: ${error}`);
    throw error;
  }
}

// Check if running in Cloud Run (HTTP trigger mode)
const isCloudRun = process.env.K_SERVICE !== undefined;

if (isCloudRun) {
  // Cloud Run mode - run task immediately and exit
  (async () => {
    try {
      Logger.info("Running in Cloud Run mode - executing task immediately");
      await executeTask();
      Logger.success("Task completed successfully");
      process.exit(0);
    } catch (error) {
      Logger.error(`Task failed: ${error}`);
      process.exit(1);
    }
  })();
} else {
  // Local development mode - run task once and exit
  (async () => {
    try {
      Logger.info("Running in local development mode");
      await executeTask();
      Logger.success("Task completed successfully");
      process.exit(0);
    } catch (error) {
      Logger.error(`Task failed: ${error}`);
      process.exit(1);
    }
  })();
}
