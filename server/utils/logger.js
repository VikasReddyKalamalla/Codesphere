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

const logger = {
  info: (message) => {
    console.log(`[INFO] ${message}`);
    writeToFile('INFO', message);
  },
  warn: (message) => {
    console.warn(`[WARN] ${message}`);
    writeToFile('WARN', message);
  },
  error: (message) => {
    console.error(`[ERROR] ${message}`);
    writeToFile('ERROR', message);
  },
};

module.exports = logger;
