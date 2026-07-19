const express = require('express');
const cors = require('cors');
const path = require('path');
const { mask, unmask } = require('./privacyShield');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Default strong wizard system prompt
const DEFAULT_SYSTEM_PROMPT = `You are Mik the Winbox Wizard (or Mik for short), a witty, legendary, certified MikroTik network engineer, RouterOS (v6 and v7) master, and packet-filtering wizard. Your job is to analyze the user's issue and RouterOS configurations/logs, find any syntax errors, logical bugs, firewall misconfigurations, routing errors, or other issues, and provide corrections.

In your explanations, you should adopt a helpful, friendly, and slightly humorous wizard persona—referring to configurations as "spells", firewalls as "protective wards", packets as "travelers", and routing tables as "ancient maps". Always greet the user with a fun wizard/MikroTik greeting, and naturally use your name ("Mik" or "Mik the Winbox Wizard") in your explanations! Keep it professional yet lighthearted.

Additionally, under any point in your EXPLANATION where you suggest a fix or a configuration change, you MUST embed a copy/pasteable, ready-to-run RouterOS terminal CLI command right there in standard Markdown code blocks, so the user can easily copy and use it!

You must return your output in three distinct sections, wrapped in the following markers:

<<<EXPLANATION>>>
Provide a clear, detailed, and professional explanation of what is broken, why it is broken, and how to fix it. Keep it concise but highly educational.
CRITICAL FORMATTING REQUIREMENT: If you provide multiple solution steps or list multiple problems/resolutions, you MUST write the corresponding RouterOS CLI command (wrapped in a copy-pasteable Markdown block, e.g., \`\`\`/ip firewall filter add ...\`\`\`) DIRECTLY below that specific solution step, instead of grouping all commands together at the end. Every individual solution step must have its own relative copy-pasteable command block immediately below its description.
<<<END_EXPLANATION>>>

<<<CORRECTED_CONFIG>>>
Provide the full corrected version of the pasted configuration or the relevant portion of it, fixing all bugs and syntax. Do not add any conversational text inside this block.
<<<END_CORRECTED_CONFIG>>>

<<<FIX_COMMANDS>>>
Provide the exact, ready-to-run RouterOS CLI terminal commands to apply the fix. Ensure these commands are syntactically valid and safe to execute in the RouterOS terminal.
<<<END_FIX_COMMANDS>>>

Strict Instructions:
1. You will see placeholders like [PRIV_IP_1], [PUB_IP_1], [MAC_1], [SECRET_1], [IFACE_1], [DOMAIN_1], [IDENTITY_1]. You MUST preserve these exact placeholders in your response's configuration and CLI commands (e.g. if the IP was [PRIV_IP_1], you must use [PRIV_IP_1] in your corrected config and commands). Do NOT invent or make up actual IP addresses or passwords to replace them. Keep them exactly as they are.
2. Maintain RouterOS CLI syntax standards. For v7, routing commands can be different from v6; match the version in the config or support both if unsure.
3. Version and Hardware guidance: Pay attention to the specified RouterOS version and hardware model (if provided). If the version is not explicitly passed, try to infer it from the context/syntax (e.g. routing filters or BGP syntax differ significantly between v6 and v7). If the version/model is critical for determining the correct command and cannot be inferred, suppose the latest RouterOS version but mention to the user that they can select their specific version/model in the UI dropdown or ask them to clarify if needed. If it's not important, just output standard universal commands. Refer to official RouterOS Markdown style structures.`;

/**
 * Dynamic language prompt injector that retains Mik's wizardly persona
 */
function getLocalizedSystemPrompt(baseSystemPrompt, language, routerOsVersion, hardwareModel) {
  let base = baseSystemPrompt || DEFAULT_SYSTEM_PROMPT;

  // Add contextual injection for RouterOS Version and Hardware Model
  let contextInjection = '';
  if (routerOsVersion && routerOsVersion !== 'auto') {
    contextInjection += `The user has explicitly specified RouterOS version: ${routerOsVersion}. Ensure all suggested spells (commands) match this version's precise syntax (especially routing filters, OSPF, and BGP if applicable).\n`;
  } else {
    contextInjection += `The RouterOS version is not explicitly set; try to detect if it is v6 or v7 from the input. If unsure and critical, suppose latest v7 but tell the user they can use the dropdown to specify, or ask them gently.\n`;
  }

  if (hardwareModel && hardwareModel !== 'auto') {
    contextInjection += `The user is running on hardware model: ${hardwareModel}. Keep any architecture/model constraints in mind (e.g. WiFiWave2 support on modern ARM devices, interface names, switch chip features, etc.).\n`;
  }

  if (contextInjection) {
    base = `${base}\n\n[CONTEXT INTEGRATION]:\n${contextInjection}`;
  }

  if (language === 'it') {
    return `${base}\n\nStrict Language Requirement:\nYou MUST output the content inside the <<<EXPLANATION>>> block entirely in Italian, using your witty and slightly humorous wizard persona (e.g., call yourself "Mik il Mago di Winbox", call configurations "incantesimi", firewalls "barriere protettive", packets "viaggiatori", and routing tables "mappe antiche"). Ensure every individual solution step contains its own relative copy-pasteable command block in Italian explanation. However, always keep standard RouterOS configuration syntax inside the <<<CORRECTED_CONFIG>>> and the <<<FIX_COMMANDS>>> blocks intact (retaining standard English commands like '/ip firewall', '/interface bridge', etc.).`;
  } else if (language === 'en') {
    return `${base}\n\nStrict Language Requirement:\nYou MUST output the content inside the <<<EXPLANATION>>> block entirely in English.`;
  } else {
    // Language: 'auto'
    return `${base}\n\nStrict Language Requirement:\nYou MUST detect the language of the user's question or logs/comments, and output the content inside the <<<EXPLANATION>>> block entirely in that same language (e.g. if the user asks in Italian, respond in Italian inside the <<<EXPLANATION>>> block using your translated witty wizard persona). Ensure every individual solution step contains its own relative copy-pasteable command block. However, always keep standard RouterOS configuration syntax inside the <<<CORRECTED_CONFIG>>> and the <<<FIX_COMMANDS>>> blocks intact (retaining standard English commands like '/ip firewall', '/interface bridge', etc.).`;
  }
}

/**
 * Proxy call to LLM providers
 */
async function callLLM({ provider, apiKey, baseUrl, model, systemPrompt, promptText, language, routerOsVersion, hardwareModel }) {
  let url = '';
  let headers = { 'Content-Type': 'application/json' };
  let body = {};

  const activeSystemPrompt = getLocalizedSystemPrompt(systemPrompt, language, routerOsVersion, hardwareModel);

  if (provider === 'openai') {
    url = 'https://api.openai.com/v1/chat/completions';
    headers['Authorization'] = `Bearer ${apiKey}`;
    body = {
      model: model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: activeSystemPrompt },
        { role: 'user', content: promptText }
      ],
      temperature: 0.2
    };
  } else if (provider === 'anthropic') {
    url = 'https://api.anthropic.com/v1/messages';
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
    body = {
      model: model || 'claude-3-5-sonnet-20240620',
      system: activeSystemPrompt,
      messages: [{ role: 'user', content: promptText }],
      max_tokens: 4000,
      temperature: 0.2
    };
  } else if (provider === 'openrouter') {
    url = 'https://openrouter.ai/api/v1/chat/completions';
    headers['Authorization'] = `Bearer ${apiKey}`;
    body = {
      model: model || 'meta-llama/llama-3-8b-instruct:free',
      messages: [
        { role: 'system', content: activeSystemPrompt },
        { role: 'user', content: promptText }
      ],
      temperature: 0.2
    };
  } else if (provider === 'ollama') {
    const host = baseUrl || 'http://localhost:11434';
    url = `${host}/api/chat`;
    body = {
      model: model || 'llama3',
      messages: [
        { role: 'system', content: activeSystemPrompt },
        { role: 'user', content: promptText }
      ],
      stream: false,
      options: {
        temperature: 0.2
      }
    };
  } else if (provider === 'custom') {
    const host = baseUrl || 'http://localhost:11434';
    url = host.endsWith('/chat/completions') ? host : `${host}/v1/chat/completions`;
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    body = {
      model: model,
      messages: [
        { role: 'system', content: activeSystemPrompt },
        { role: 'user', content: promptText }
      ],
      temperature: 0.2
    };
  } else {
    throw new Error(`Unknown LLM provider: ${provider}`);
  }

  console.log(`🧙‍♂️ [Mik the Winbox Wizard] Proxying request to provider: ${provider}, URL: ${url}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM provider (${provider}) returned status ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  if (provider === 'openai' || provider === 'openrouter' || provider === 'custom') {
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error(`Invalid response schema from ${provider}: ${JSON.stringify(data)}`);
    }
    return data.choices[0].message.content;
  } else if (provider === 'anthropic') {
    if (!data.content || !data.content[0]) {
      throw new Error(`Invalid response schema from Anthropic: ${JSON.stringify(data)}`);
    }
    return data.content[0].text;
  } else if (provider === 'ollama') {
    if (!data.message) {
      throw new Error(`Invalid response schema from Ollama: ${JSON.stringify(data)}`);
    }
    return data.message.content;
  }
}

/**
 * Parses response wrapped in <<<EXPLANATION>>> etc.
 */
function parseSections(response) {
  let explanation = '';
  let correctedConfig = '';
  let fixCommands = '';

  const expMatch = /<<<EXPLANATION>>>([\s\S]*?)<<<END_EXPLANATION>>>/i.exec(response);
  if (expMatch) explanation = expMatch[1].trim();

  const configMatch = /<<<CORRECTED_CONFIG>>>([\s\S]*?)<<<END_CORRECTED_CONFIG>>>/i.exec(response);
  if (configMatch) correctedConfig = configMatch[1].trim();

  const fixMatch = /<<<FIX_COMMANDS>>>([\s\S]*?)<<<END_FIX_COMMANDS>>>/i.exec(response);
  if (fixMatch) fixCommands = fixMatch[1].trim();

  // Fallback if formatting was ignored by LLM
  if (!explanation && !correctedConfig && !fixCommands) {
    explanation = response;
  }

  return { explanation, correctedConfig, fixCommands };
}

/**
 * Endpoint: Chat & Analyze Configuration with Privacy Shield
 */
app.post('/api/chat', async (req, res) => {
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

    if (!chatMessage && !pastedConfig) {
      return res.status(400).json({ error: 'Either chatMessage or pastedConfig is required' });
    }

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
    console.log('🛡️ [Mik\'s Privacy Shield] Casting masking spell on user input...');
    const { maskedText, mapping } = mask(combinedInput, maskOptions);

    console.log('🛡️ [Mik\'s Privacy Shield] Masking complete. Channeling masked query to the LLM.');

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

    console.log('🔮 [Mik the Winbox Wizard] Response received! Breaking the masking spell to restore original values...');

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
    console.error('[Error] Chat processing failed:', error);
    res.status(500).json({ error: error.message || 'An error occurred during chat processing' });
  }
});

/**
 * Endpoint: Test Connection to Provider
 */
app.post('/api/test-connection', async (req, res) => {
  try {
    const { provider, apiKey, baseUrl, model } = req.body;

    console.log(`[Connection Test] Testing connection to ${provider}...`);

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
    console.error('[Connection Test Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🧙‍♂️ 🚀 Mik the Winbox Wizard is running at http://localhost:${PORT}`);
});
