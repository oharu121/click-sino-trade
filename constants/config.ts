interface Config {
  // LINE configuration
  lineGroupId: string;

  // Task scheduling
  cronSchedule: string;

  // Browser configuration
  browserTimeout: number;
  maxRetries: number;

  // Logging
  logLevel: string;
}

const config: Config = {
  // LINE configuration
  lineGroupId: process.env.LINE_GROUP_ID || "C07043bf7944b51ee170ec5f4092e9b54",

  // Task scheduling - can be overridden via environment variable
  cronSchedule: process.env.CRON_SCHEDULE || "0 * * * *", // Every hour by default

  // Browser configuration
  browserTimeout: parseInt(process.env.BROWSER_TIMEOUT || "60000"),
  maxRetries: parseInt(process.env.MAX_RETRIES || "10"),

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",
};

export default config;
