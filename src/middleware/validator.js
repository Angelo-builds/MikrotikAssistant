/**
 * Lightweight, secure input validation and sanitization middleware.
 * Avoids heavy validation packages while strictly verifying parameters, types, and length bounds.
 */

const VALID_PROVIDERS = ['openai', 'anthropic', 'openrouter', 'ollama', 'custom'];
const VALID_LANGUAGES = ['auto', 'en', 'it'];

// Sanitizes standard strings by converting potential HTML tag markers
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function validateChatInput(req, res, next) {
  const {
    pastedConfig,
    chatMessage,
    chatHistory,
    provider,
    apiKey,
    baseUrl,
    model,
    systemPrompt,
    language,
    maskOptions,
    routerOsVersion,
    hardwareModel
  } = req.body;

  // 1. Mandatory check: Either chatMessage or pastedConfig must be provided
  if (!chatMessage && !pastedConfig) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Either chatMessage or pastedConfig is required to consult the wizard.'
    });
  }

  // 2. Validate input size/length to prevent Denial of Service (DoS) attacks
  if (pastedConfig && pastedConfig.length > 500 * 1024) { // 500 KB Limit
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Attached RouterOS configuration size exceeds the maximum limit (500 KB).'
    });
  }

  if (chatMessage && chatMessage.length > 10000) { // 10k character limit
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Chat message is too long (Max 10,000 characters).'
    });
  }

  // 3. Validate provider
  if (!provider) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Provider is required.'
    });
  }

  if (!VALID_PROVIDERS.includes(provider)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Invalid provider: '${provider}'. Valid providers are: ${VALID_PROVIDERS.join(', ')}`
    });
  }

  // 4. Validate API key for cloud providers
  if (['openai', 'anthropic', 'openrouter'].includes(provider) && !apiKey) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `API Key is required when using cloud provider '${provider}'.`
    });
  }

  // 5. Validate and sanitize other parameters
  if (language && !VALID_LANGUAGES.includes(language)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Invalid language '${language}'. Valid options are auto, en, it.`
    });
  }

  // 6. Validate chat history structure if provided
  if (chatHistory !== undefined) {
    if (!Array.isArray(chatHistory)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'chatHistory must be an array of message turns.'
      });
    }

    for (const turn of chatHistory) {
      if (typeof turn !== 'object' || turn === null) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Every chat history item must be an object.'
        });
      }
    }
  }

  // Sanitize simple inputs
  req.body.chatMessage = sanitizeString(chatMessage);
  if (model) req.body.model = sanitizeString(model);
  if (baseUrl) req.body.baseUrl = sanitizeString(baseUrl);
  if (routerOsVersion) req.body.routerOsVersion = sanitizeString(routerOsVersion);
  if (hardwareModel) req.body.hardwareModel = sanitizeString(hardwareModel);

  next();
}

function validateTestConnectionInput(req, res, next) {
  const { provider, apiKey, baseUrl, model } = req.body;

  if (!provider) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Provider is required to test connectivity.'
    });
  }

  if (!VALID_PROVIDERS.includes(provider)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Invalid provider: '${provider}'.`
    });
  }

  if (['openai', 'anthropic', 'openrouter'].includes(provider) && !apiKey) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `API Key is required to test connectivity for cloud provider '${provider}'.`
    });
  }

  if (model) req.body.model = sanitizeString(model);
  if (baseUrl) req.body.baseUrl = sanitizeString(baseUrl);

  next();
}

module.exports = {
  validateChatInput,
  validateTestConnectionInput
};
