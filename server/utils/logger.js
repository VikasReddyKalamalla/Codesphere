const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const getTimestamp = () => new Date().toISOString();

const writeToFile = (level, message) => {
  const logFile = path.join(logDir, `${new Date().toISOString().slice(0, 10)}.log`);
  const entry = `[${getTimestamp()}] [${level}] ${message}\n`;
  fs.appendFileSync(logFile, entry);
};

const isProd = process.env.NODE_ENV === 'production';

const formatLog = (level, message, meta = {}) => {
  if (isProd) {
    return JSON.stringify({
      timestamp: getTimestamp(),
      level,
      message: typeof message === 'object' ? JSON.stringify(message) : message,
      ...meta,
    });
  }
  return `[${level}] ${typeof message === 'object' ? JSON.stringify(message) : message}`;
};

const logger = {
  info: (message, meta) => {
    const formatted = formatLog('INFO', message, meta);
    console.log(formatted);
    writeToFile('INFO', message);
  },
  warn: (message, meta) => {
    const formatted = formatLog('WARN', message, meta);
    console.warn(formatted);
    writeToFile('WARN', message);
  },
  error: (message, meta) => {
    const formatted = formatLog('ERROR', message, meta);
    console.error(formatted);
    writeToFile('ERROR', message);
  },
};

module.exports = logger;
