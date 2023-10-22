import winston from 'winston';

const customFormat = winston.format.printf((entry: any) => {
  let propsLine = '';

  for (const [key, value] of Object.entries(entry)) {
    if (['timestamp', 'service', 'level', 'message'].indexOf(key) === -1) {
      propsLine += `${key}=${value} `;
    }
  }

  const service = entry.service ? entry.service : 'unknown';

  return `${entry.timestamp} ${('[' + service + ']').padEnd(16)} ${entry.level.padEnd(5)}: ${entry.message.padEnd(
    60,
  )} ${propsLine.length > 0 ? propsLine.slice(0, -1) : ''}`;
});

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), customFormat),
  transports: [new winston.transports.Console({})],
});

export default logger;
