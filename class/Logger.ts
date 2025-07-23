import paths from "../constants/paths";
import winston from "winston";

// Define custom logging levels and colors for better organization
const customLevels = {
  levels: {
    error: 0, // Most critical
    warn: 1,
    info: 2,
    task: 3, // Custom level for specific tasks
    success: 4, // Custom level for success messages
    debug: 5, // Least critical
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "blue",
    task: "magenta",
    success: "green",
    debug: "white",
  },
};

// Add colors to Winston
winston.addColors(customLevels.colors);

// Define a type for our custom logger to provide type safety and autocompletion
type CustomLogger = winston.Logger & {
  [level in keyof typeof customLevels.levels]: winston.LeveledLogMethod;
};

class Logger {
  // Make the logger instance private and readonly
  private readonly logger: CustomLogger;

  constructor() {
    // Format for console output: colorized, simple, and human-readable
    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: "HH:mm:ss" }),
      winston.format.printf(
        (log) => `[${log.timestamp}] ${log.level}: ${log.message}`
      )
    );

    // Format for file output: structured JSON for easy parsing
    const fileFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    );

    this.logger = winston.createLogger({
      // Use our custom levels
      levels: customLevels.levels,
      // Default level to log (logs everything from 'debug' up)
      level: "debug",
      transports: [
        // Console transport for development feedback
        new winston.transports.Console({
          format: consoleFormat,
        }),
        // File transport for errors
        new winston.transports.File({
          filename: paths.ERROR_LOG_PATH,
          level: "error", // Only log errors to this file
          format: fileFormat,
        }),
        // File transport for all logs
        new winston.transports.File({
          filename: paths.COMBINED_LOG_PATH,
          format: fileFormat,
        }),
      ],
    }) as CustomLogger;
  }

  // Public methods now act as clean wrappers around the Winston instance
  public success(msg: string) {
    this.logger.success(msg);
  }

  public error(msg: string) {
    if (!msg) return;
    this.logger.error(msg);
  }

  public info(msg: string) {
    if (!msg) return;
    this.logger.info(msg);
  }

  public warn(msg: string) {
    this.logger.warn(msg);
  }

  public task(msg: string) {
    this.logger.task(msg);
  }

  public debug(msg: string) {
    this.logger.debug(msg);
  }
}

// Export a single, shared instance of the logger
export default new Logger();
