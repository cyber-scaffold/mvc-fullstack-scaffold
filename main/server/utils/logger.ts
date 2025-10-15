import moment from "moment";
import DailyRotateFile from "winston-daily-rotate-file";
import { createLogger, format, transports } from "winston";

const { timestamp, combine, printf, splat, label, colorize } = format;

export const logger = createLogger({
  level: "error",
  format: combine(
    splat(),
    colorize(),
    label({ label: "process" }),
    timestamp(),
    printf((params) => {
      const { level, message, label, timestamp } = params;
      return `${moment(timestamp).format("YYYY-MM-DD HH:mm:ss")} [${label}] [${level}] ${message}`;
    })
  ),
  transports: [
    new transports.Console({ level: "info" }),
    new DailyRotateFile({
      frequency: "1d",
      level: "error",
      extension: ".log",
      dirname: "logs",
      datePattern: "YYYY-MM-DD-HH-mm-ss",
      filename: "logger",
      maxSize: "10m",
      maxFiles: 2
    }),
  ],
});