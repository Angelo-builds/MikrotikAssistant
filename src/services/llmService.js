const logger = require('../utils/logger');
const { DEFAULT_SYSTEM_PROMPT } = require('../config');

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

  logger.info(`Proxying request to provider: ${provider}, URL: ${url}`);

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

module.exports = {
  callLLM,
  parseSections,
  getLocalizedSystemPrompt
};
