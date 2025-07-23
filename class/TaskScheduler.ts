import cron, { ScheduledTask } from "node-cron";
import Logger from "./Logger";
import LINE from "./LINE";
import SinoTrade from "./SinoTrade";
import config from "../constants/config";

interface TaskConfig {
  name: string;
  cronExpression: string;
  command: () => Promise<void>;
}

// A type for the dictionary holding scheduled tasks
type ScheduledTasks = {
  [taskName: string]: ScheduledTask;
};

class TaskScheduler {
  private groupId = config.lineGroupId;
  private scheduledTasks: ScheduledTasks = {};

  // A clear, centralized configuration for all scheduled tasks.
  private readonly taskConfig: TaskConfig[] = [
    {
      name: "點擊生產總經",
      cronExpression: config.cronSchedule, // Configurable via environment variable
      command: async () => {
        try {
          await SinoTrade.main();
        } catch (error) {
          // Attempt to reset browser context on failure
          const Playwright = (await import("./Playwright")).default;
          await Playwright.resetContext();
          throw error; // Re-throw to trigger error handling
        }
      },
    },
  ];

  /**
   * Starts the scheduler and schedules all tasks from the configuration.
   */
  public start(): void {
    this.taskConfig.forEach((task) => this.scheduleTask(task));
  }

  /**
   * Schedules a single task based on its configuration.
   * @param {TaskConfig} taskConfig - The configuration object for the task.
   */
  private scheduleTask(taskConfig: TaskConfig): void {
    const { name, cronExpression, command } = taskConfig;

    if (this.scheduledTasks[name]) {
      Logger.warn(
        `Task "${name}" already scheduled. Stopping existing task first.`
      );
      this.scheduledTasks[name]!.stop();
    }

    // Validate the cron expression before scheduling
    if (!cron.validate(cronExpression)) {
      Logger.error(
        `Invalid cron expression "${cronExpression}" for task "${name}". Task will not be scheduled.`
      );
      return;
    }

    const job = cron.schedule(cronExpression, async () => {
      Logger.info(`Running task: "${name}"`);
      try {
        await command();
      } catch (error) {
        let errorMessage: string;
        if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = String(error);
        }

        Logger.error(`Error running task "${name}": ${errorMessage}`);

        const notification = [
          `{everyone} {sad}\n`,
          `**タスク実行エラーのお知らせ** 🚨`,
          `**タスク名**: ${name}`,
          `**エラー内容**: ${errorMessage}`,
        ].join("\n");

        await this.postToChannel(notification);
      }
    });

    this.scheduledTasks[name] = job;
    Logger.info(
      `Task "${name}" scheduled with cron expression "${cronExpression}"`
    );
  }

  /**
   * Stops a specific running task by its name.
   * @param {string} taskName - The name of the task to stop.
   */
  public stopTask(taskName: string): void {
    const task = this.scheduledTasks[taskName];
    if (task) {
      task.stop();
      delete this.scheduledTasks[taskName];
      Logger.info(`Task "${taskName}" was stopped.`);
    } else {
      Logger.warn(`Task "${taskName}" not found or not running.`);
    }
  }

  public async stopAllTasks(): Promise<void> {
    Logger.task("Stopping all scheduled tasks...");
    for (const taskName in this.scheduledTasks) {
      this.scheduledTasks[taskName]!.stop();
    }
    this.scheduledTasks = {}; // Clear the tasks object

    // Cleanup browser resources
    try {
      const Playwright = (await import("./Playwright")).default;
      await Playwright.cleanup();
    } catch (error) {
      Logger.error(`Error during browser cleanup: ${error}`);
    }

    Logger.success("All scheduled tasks have been stopped.");
  }

  /**
   * Execute a specific task immediately (for Cloud Run triggers)
   * @param {string} taskName - The name of the task to execute
   */
  public async executeTask(taskName: string): Promise<void> {
    const task = this.taskConfig.find((t) => t.name === taskName);
    if (!task) {
      throw new Error(`Task "${taskName}" not found`);
    }

    Logger.info(`Executing task: "${taskName}"`);
    await task.command();
  }

  /**
   * Get the list of currently scheduled tasks (for health checks)
   */
  public getScheduledTasks(): ScheduledTasks {
    return { ...this.scheduledTasks };
  }

  /**
   * A private helper to post messages to a Viber channel.
   * @param {string} message - The message to post.
   */
  private async postToChannel(message: string): Promise<void> {
    try {
      await LINE.sendText(this.groupId, message);
    } catch (error) {
      Logger.error(`Failed to send Viber notification: ${error}`);
    }
  }
}

export default new TaskScheduler();
