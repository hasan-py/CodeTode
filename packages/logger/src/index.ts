export class Logger {
  private static colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m",
    reset: "\x1b[0m",
  };

  private static formatMessage(
    message: string,
    color: string,
    data?: any
  ): void {
    console.log(`${color}${message}${this.colors.reset}`, data || "");
  }

  static error(message: string, data?: any): void {
    this.formatMessage(message, this.colors.red, data);
  }

  static success(message: string, data?: any): void {
    this.formatMessage(message, this.colors.green, data);
  }

  static warning(message: string, data?: any): void {
    this.formatMessage(message, this.colors.yellow, data);
  }

  static info(message: string, data?: any): void {
    this.formatMessage(message, this.colors.blue, data);
  }

  static debug(message: string, data?: any): void {
    this.formatMessage(message, this.colors.magenta, data);
  }

  static log(message: string, data?: any): void {
    this.formatMessage(message, this.colors.cyan, data);
  }

  static optional(message: string, data?: any): void {
    this.formatMessage(message, this.colors.gray, data);
  }
}
