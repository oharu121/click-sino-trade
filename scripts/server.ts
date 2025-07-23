import http from "http";
import Logger from "../class/Logger";
import SinoTrade from "../class/SinoTrade";

const PORT = process.env.PORT || 8080;

// Main execution function
async function executeTask(): Promise<string> {
  try {
    Logger.info("Starting SinoTrade task execution");
    await SinoTrade.main();
    Logger.success("Task completed successfully");
    return "Task completed successfully";
  } catch (error) {
    Logger.error(`Task failed: ${error}`);
    throw error;
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Only allow POST requests (for Cloud Scheduler)
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed. Use POST." }));
    return;
  }

  try {
    Logger.info("Received HTTP request, executing task...");
    const result = await executeTask();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "success",
        message: result,
        timestamp: new Date().toISOString(),
      })
    );
  } catch (error) {
    Logger.error(`HTTP request failed: ${error}`);

    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "error",
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      })
    );
  }
});

// Start the server
server.listen(PORT, () => {
  Logger.info(`Server listening on port ${PORT}`);
  Logger.info("Ready to receive Cloud Scheduler requests");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  Logger.info("Received SIGTERM, shutting down gracefully...");
  server.close(() => {
    Logger.info("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  Logger.info("Received SIGINT, shutting down gracefully...");
  server.close(() => {
    Logger.info("Server closed");
    process.exit(0);
  });
});
