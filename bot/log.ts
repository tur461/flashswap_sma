import { createLogger, format, transports } from 'winston';
import { CONFIG } from '../constants';

const log = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}` + (info.splat !== undefined ? `${info.splat}` : ' ')
    )
  ),
  transports: [new transports.Console({ level: CONFIG.LOG_LEVEL })],
});

export const cLog = console.log;

export default log;
