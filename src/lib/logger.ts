const reset = "\x1b[0m";

const colors = {
  gray: "\x1b[90m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

function timestamp(): string {
  return new Date().toLocaleTimeString("ru-RU", { hour12: false });
}

function format(level: string, color: string, ...args: any[]): string {
  const time = `${colors.gray}[${timestamp()}]${reset}`;
  const tag = `${colors.bold}${color}${level}${reset}`;
  return `${time} ${tag} ${args.join(" ")}`;
}

const Logger = {
  info(...args: any[]) {
    console.log(format("INFO ", colors.cyan, ...args));
  },

  success(...args: any[]) {
    console.log(format("OK   ", colors.green, ...args));
  },

  warn(...args: any[]) {
    console.warn(format("WARN ", colors.yellow, ...args));
  },

  error(...args: any[]) {
    console.error(format("ERROR", colors.red, ...args));
  },
};

export default Logger;
