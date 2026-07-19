/**
 * Witty, legendary wizard-themed logger (Mik Logger)
 */

function formatMessage(message) {
  return `🧙‍♂️ [Mik the Winbox Wizard] ${message}`;
}

const logger = {
  info: (message) => {
    console.log(formatMessage(message));
  },
  warn: (message) => {
    console.warn(`⚠️  [Mik the Winbox Wizard] ${message}`);
  },
  error: (message, error) => {
    if (error) {
      console.error(`💥 [Mik the Winbox Wizard] ${message}`, error);
    } else {
      console.error(`💥 [Mik the Winbox Wizard] ${message}`);
    }
  },
  debug: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔍 [Mik the Winbox Wizard] ${message}`);
    }
  }
};

module.exports = logger;
