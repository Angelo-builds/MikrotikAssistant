const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { mask, unmask } = require('../services/privacyService');
const { callLLM, parseSections } = require('../services/llmService');
const { validateChatInput, validateTestConnectionInput } = require('../middleware/validator');

/**
 * Endpoint: Chat & Analyze Configuration with Privacy Shield
 */
router.post('/chat', validateChatInput, async (req, res, next) => {
  try {
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

    let historyText = '';
    if (chatHistory && chatHistory.length > 0) {
      historyText += `[PRIOR CONVERSATION HISTORY]:\n`;
      chatHistory.forEach((turn, index) => {
        historyText += `--- Conversation Turn #${index + 1} ---\n`;
        historyText += `[USER QUESTION]:\n${turn.chatMessage || '(No message)'}\n`;
        if (turn.pastedConfig) {
          historyText += `[USER ATTACHED RSC CONFIG]:\n${turn.pastedConfig}\n`;
        }
        historyText += `[ASSISTANT EXPLANATION]:\n${turn.explanation || '(No explanation)'}\n`;
        if (turn.correctedConfig) {
          historyText += `[ASSISTANT CORRECTED CONFIG]:\n${turn.correctedConfig}\n`;
        }
        if (turn.fixCommands) {
          historyText += `[ASSISTANT FIX COMMANDS]:\n${turn.fixCommands}\n`;
        }
        historyText += `\n`;
      });
      historyText += `\n[CURRENT / NEW CONVERSATION TURN]:\n`;
    }

    // Combine user message and pasted config into a single cohesive layout for the LLM
    const combinedInput = `${historyText}[USER QUESTION/ISSUE]:\n${chatMessage || 'Please analyze this configuration for errors or potential improvements.'}\n\n[ROUTEROS CONFIG / LOGS / EXPORT]:\n\`\`\`\n${pastedConfig || '(No configuration pasted)'}\n\`\`\`\n`;

    // Apply the Privacy Shield masking
    logger.info("🛡️ [Privacy Shield] Casting masking spell on user input...");
    const { maskedText, mapping } = mask(combinedInput, maskOptions);

    logger.info("🛡️ [Privacy Shield] Masking complete. Channeling masked query to the LLM.");

    // Send to LLM Proxy
    const llmRawResponse = await callLLM({
      provider,
      apiKey,
      baseUrl,
      model,
      systemPrompt,
      promptText: maskedText,
      language: language || 'auto',
      routerOsVersion,
      hardwareModel
    });

    logger.info("🔮 Response received! Breaking the masking spell to restore original values...");

    // Restore the original data in the LLM's raw response
    const unmaskedRawResponse = unmask(llmRawResponse, mapping);

    // Parse the sections
    const { explanation, correctedConfig, fixCommands } = parseSections(unmaskedRawResponse);

    res.json({
      success: true,
      explanation,
      correctedConfig,
      fixCommands,
      rawResponse: unmaskedRawResponse,
      maskedRawResponse: llmRawResponse // sent for transparency/debug
    });

  } catch (error) {
    next(error);
  }
});

/**
 * Endpoint: Test Connection to Provider
 */
router.post('/test-connection', validateTestConnectionInput, async (req, res, next) => {
  try {
    const { provider, apiKey, baseUrl, model } = req.body;

    logger.info(`[Connection Test] Testing connection to ${provider}...`);

    const testPrompt = "Respond with exactly the word 'SUCCESS' and nothing else.";
    const response = await callLLM({
      provider,
      apiKey,
      baseUrl,
      model,
      systemPrompt: "You are a testing assistant. Follow instructions precisely.",
      promptText: testPrompt
    });

    if (response.toUpperCase().includes('SUCCESS')) {
      res.json({ success: true, message: 'Connection verified successfully!' });
    } else {
      res.json({ success: false, message: `Unexpected response: ${response}` });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
