const express = require('express');
const cors = require('cors');
const path = require('path');
const { mask, unmask } = require('./privacyShield');
const { injectContext } = require('./mikrotik-wiki-context');

const app = express();

/**
 * Extracts only the /ip firewall filter and /ip firewall nat sections from a RouterOS configuration.
 */
function extractFirewallSections(configText) {
  if (!configText) return '';
  const lines = configText.split('\n');
  let inTargetSection = false;
  const extractedLines = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('/')) {
      const lower = trimmed.toLowerCase();
      if (lower.startsWith('/ip firewall filter') || lower.startsWith('/ip firewall nat')) {
        inTargetSection = true;
        extractedLines.push(line);
      } else {
        inTargetSection = false;
      }
    } else if (inTargetSection) {
      extractedLines.push(line);
    }
  }
  return extractedLines.join('\n');
}
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Expose static route for diff library
app.use('/vendor/diff', express.static(path.join(__dirname, 'node_modules', 'diff', 'dist')));

// Default strong wizard system prompt
const DEFAULT_SYSTEM_PROMPT = `You are Mik the Winbox Wizard (or Mik for short), an authoritative, certified Senior MikroTik Network Engineer and RouterOS (v6 and v7) master. Your job is to analyze the user's issue and RouterOS configurations/logs, identify any syntax errors, logical bugs, firewall misconfigurations, routing errors, or security vulnerabilities, and provide highly precise corrections.

TONE & PERSONALITY Guidelines:
1. STRICTLY PROFESSIONAL & TECHNICAL: Remove ALL fantasy metaphors (no magic, wizards, spells, castles, protective wards, packet travelers, or ancient maps).
2. Be direct, concise, and authoritative. Speak and act like a Senior Network Engineer.
3. Use clear headings, bullet points, and proper RouterOS terminology.
4. NEVER output conversational filler or friendly/lighthearted greetings. Get straight to the analysis.

MANDATORY ANALYSIS CHECKLIST:
Before formulating your response, you MUST silently verify the following against the user's configuration:
- Redundant NAT/Masquerade rules (e.g., specific VLAN NAT rules when a general 'out-interface=WAN' rule exists).
- Firewall rule ordering (e.g., 'drop invalid' rules MUST be positioned before 'accept' rules; DNS/input rules must not be exposed to WAN).
- Security holes (e.g., overly permissive input/forward rules, lack of isolation for sensitive segments such as IoT VLANs).
- Bridge/VLAN completeness (e.g., correct PVID settings, tagged vs. untagged port associations, and bridge vlan-filtering enabled).

MERMAID DIAGRAM GUIDELINES:
When generating Mermaid diagrams, use SIMPLE flowchart syntax only. Avoid complex tables, subgraphs, or special characters. Use basic node connections with arrows.
Example of simple flowchart syntax:
\`\`\`mermaid
graph TD
    Bridge[Bridge VLAN Filtering]
    VLAN10[VLAN 10 - Management<br/>10.10.10.0/24]
    VLAN20[VLAN 20 - Users<br/>192.168.20.0/24]
    ether2[ether2 - PVID 10]
    ether3[ether3 - PVID 20]
    ether5[ether5 - Trunk]

    Bridge --> VLAN10
    Bridge --> VLAN20
    VLAN10 --> ether2
    VLAN20 --> ether3
    Bridge --> ether5
\`\`\`

RESPONSE FORMAT REQUIREMENTS:
You must return your output in three distinct sections, wrapped in the following markers:

<<<EXPLANATION>>>
Provide your professional explanation inside this block strictly structured as follows:
1. Start with a 1-sentence summary of the main issue.
2. Use a "## Critical Issues Found" section to detail security flaws, misconfigurations, or major bugs found during the checklist verification. Use bullet points and clear technical explanations.
3. Use a "## Configuration Fixes" section to explain each required fix.
   CRITICAL FORMATTING REQUIREMENT: If you provide multiple solution steps or list multiple problems/resolutions, you MUST write the corresponding RouterOS CLI command (wrapped in copy-pasteable Markdown blocks, e.g., \`\`\`/ip firewall filter add ...\`\`\`) DIRECTLY below that specific solution step, instead of grouping all commands together at the end. Every individual solution step must have its own relative copy-pasteable command block immediately below its description.
4. End with a "## Verification Commands" section providing the exact CLI commands (e.g., \`/interface bridge host print\`, \`/ping ...\`) the user should run to verify the configuration.
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
3. Version and Hardware guidance: Pay attention to the specified RouterOS version and hardware model (if provided). If the version is not explicitly passed, try to infer it from the context/syntax (e.g. routing filters or BGP syntax differ significantly between v6 and v7). If the version/model is critical for determining the correct command and cannot be inferred, suppose the latest RouterOS version but mention to the user that they can select their specific version/model in the UI dropdown or ask them to clarify if needed. If it's not important, just output standard universal commands. Refer to official RouterOS Markdown style structures.
4. Always verify firewall rule order. 'drop invalid' must precede 'accept' rules. Never suggest redundant rules that already exist in the provided config. Eliminate false positives.
5. Output ONLY the specific delta commands needed to fix the issue, not the entire configuration, unless a full rewrite is explicitly requested.`;

/**
 * Dynamic language prompt injector that retains Mik's wizardly persona
 */
function getLocalizedSystemPrompt(baseSystemPrompt, language, routerOsVersion, hardwareModel) {
  let base = baseSystemPrompt || DEFAULT_SYSTEM_PROMPT;

  // Add contextual injection for RouterOS Version and Hardware Model
  let contextInjection = '';
  if (routerOsVersion && routerOsVersion !== 'auto') {
    contextInjection += `The user has explicitly specified RouterOS version: ${routerOsVersion}. Ensure all suggested commands match this version's precise syntax (especially routing filters, OSPF, and BGP if applicable).\n`;
  } else {
    contextInjection += `The RouterOS version is not explicitly set; try to detect if it is v6 or v7 from the input. If unsure and critical, suppose latest v7 but tell the user they can use the dropdown to specify, or ask them directly.\n`;
  }

  if (hardwareModel && hardwareModel !== 'auto') {
    contextInjection += `The user is running on hardware model: ${hardwareModel}. Keep any architecture/model constraints in mind (e.g. WiFiWave2 support on modern ARM devices, interface names, switch chip features, etc.).\n`;
  }

  if (contextInjection) {
    base = `${base}\n\n[CONTEXT INTEGRATION]:\n${contextInjection}`;
  }

  if (language === 'it') {
    return `${base}\n\nStrict Language Requirement:\nYou MUST output the content inside the <<<EXPLANATION>>> block entirely in Italian, using a strictly professional, technical, and authoritative tone as a Senior Network Engineer. Ensure all fantasy metaphors are completely omitted (do NOT call configurations "incantesimi", firewalls "barriere protettive", packets "viaggiatori", or routing tables "mappe antiche"). Keep the response structured with headers and bullet points. Always keep standard RouterOS configuration syntax inside the <<<CORRECTED_CONFIG>>> and the <<<FIX_COMMANDS>>> blocks intact (retaining standard English commands like '/ip firewall', '/interface bridge', etc.).`;
  } else if (language === 'en') {
    return `${base}\n\nStrict Language Requirement:\nYou MUST output the content inside the <<<EXPLANATION>>> block entirely in English.`;
  } else {
    // Language: 'auto'
    return `${base}\n\nStrict Language Requirement:\nYou MUST detect the language of the user's question or logs/comments, and output the content inside the <<<EXPLANATION>>> block entirely in that same language, adhering to the strictly professional, technical, and authoritative Senior Network Engineer persona. Completely omit any fantasy metaphors or friendly conversational filler in the translation. Keep standard RouterOS configuration syntax inside the <<<CORRECTED_CONFIG>>> and the <<<FIX_COMMANDS>>> blocks intact (retaining standard English commands like '/ip firewall', '/interface bridge', etc.).`;
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

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });
  } catch (fetchError) {
    if (provider === 'ollama') {
      const host = baseUrl || 'http://localhost:11434';
      throw new Error(`Ollama local LLM is not running or unreachable at ${host}. Please make sure Ollama is started (run 'ollama serve') and the model '${model || 'llama3'}' is pulled. (Error: ${fetchError.message})`);
    }
    throw fetchError;
  }

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
    let {
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
      hardwareModel,
      mode
    } = req.body;

    if (!chatMessage && !pastedConfig) {
      return res.status(400).json({ error: 'Either chatMessage or pastedConfig is required' });
    }

    // Detect and strip mode tag indicators from chatMessage
    if (chatMessage) {
      if (chatMessage.includes('[DEEP_DIVE]')) {
        mode = 'orchestrator';
        chatMessage = chatMessage.replace(/\[DEEP_DIVE\]/g, '').trim();
      }
      if (chatMessage.includes('[FIREWALL_AUDIT]')) {
        chatMessage = chatMessage.replace(/\[FIREWALL_AUDIT\]/g, '').trim();
      }
      if (chatMessage.includes('[VLAN_TOPOLOGY]')) {
        chatMessage = chatMessage.replace(/\[VLAN_TOPOLOGY\]/g, '').trim();
      }
    }

    console.log(`🤖 [Backend API] Received request with mode: "${mode || 'standard'}", chatMessage: "${chatMessage || ''}"`);

    // Override or supply defaults from environment variables if set
    if (process.env.LLM_PROVIDER) {
      provider = process.env.LLM_PROVIDER;
      if (process.env.LLM_MODEL) {
        model = process.env.LLM_MODEL;
      }
      if (process.env.LLM_BASE_URL) {
        baseUrl = process.env.LLM_BASE_URL;
      }
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

    if (mode === 'orchestrator') {
      console.log('🤖 [Multi-Agent Orchestrator] Mode detected. Executing agents in parallel...');
      const agents = require('./agents');

      console.log('🤖 [Multi-Agent Orchestrator] Initiating concurrent parallel LLM calls for Security, VLAN, and Routing...');
      // Call the LLM 3 times concurrently
      const [securityRes, vlanRes, routingRes] = await Promise.all([
        callLLM({
          provider,
          apiKey,
          baseUrl,
          model,
          systemPrompt: agents.security,
          promptText: maskedText,
          language: language || 'auto',
          routerOsVersion,
          hardwareModel
        }),
        callLLM({
          provider,
          apiKey,
          baseUrl,
          model,
          systemPrompt: agents.vlan,
          promptText: maskedText,
          language: language || 'auto',
          routerOsVersion,
          hardwareModel
        }),
        callLLM({
          provider,
          apiKey,
          baseUrl,
          model,
          systemPrompt: agents.routing,
          promptText: maskedText,
          language: language || 'auto',
          routerOsVersion,
          hardwareModel
        })
      ]);
      console.log('🤖 [Multi-Agent Orchestrator] Concurrently called Security, VLAN, and Routing LLMs returned responses successfully!');

      // Synthesize into an Executive Summary using a final, fast LLM call
      const summaryPrompt = `You are Mik the Winbox Wizard. Synthesize the following 3 reports into a concise, professional Executive Summary for a Senior Network Engineer. Keep it brief, action-oriented, and highlight critical vulnerabilities or misconfigurations.

Reports:
--- SECURITY REPORT ---
${securityRes}

--- VLAN REPORT ---
${vlanRes}

--- ROUTING REPORT ---
${routingRes}`;

      const executiveSummaryRes = await callLLM({
        provider,
        apiKey,
        baseUrl,
        model,
        systemPrompt: "You are a MikroTik Executive Summarizer.",
        promptText: summaryPrompt,
        language: language || 'auto',
        routerOsVersion,
        hardwareModel
      });

      // Extract a Unified Fix Script
      const fixScriptPrompt = `Combine all actionable CLI commands from the following 3 reports into a single, logically ordered RouterOS script. Do NOT include any markdown blocks, comments, or explanations outside the script. Ensure there is only standard valid RouterOS CLI commands.

Reports:
--- SECURITY REPORT ---
${securityRes}

--- VLAN REPORT ---
${vlanRes}

--- ROUTING REPORT ---
${routingRes}`;

      const unifiedFixScriptRes = await callLLM({
        provider,
        apiKey,
        baseUrl,
        model,
        systemPrompt: "You are a RouterOS CLI Script Combiner. Output only valid RouterOS terminal commands.",
        promptText: fixScriptPrompt,
        language: 'en', // Keep CLI script strictly in English
        routerOsVersion,
        hardwareModel
      });

      // Unmask everything
      const unmaskedExecSummary = unmask(executiveSummaryRes, mapping);
      const unmaskedSecurity = unmask(securityRes, mapping);
      const unmaskedVlan = unmask(vlanRes, mapping);
      const unmaskedRouting = unmask(routingRes, mapping);

      // Clean up markdown block fences from unified fix script and unmask it
      let cleanedFixScript = unifiedFixScriptRes.trim();
      if (cleanedFixScript.startsWith('```')) {
        // Find index of first newline
        const firstNL = cleanedFixScript.indexOf('\n');
        if (firstNL !== -1) {
          cleanedFixScript = cleanedFixScript.substring(firstNL + 1);
        }
        if (cleanedFixScript.endsWith('```')) {
          cleanedFixScript = cleanedFixScript.substring(0, cleanedFixScript.length - 3);
        }
      }
      const unmaskedUnifiedFixScript = unmask(cleanedFixScript.trim(), mapping);

      const orchestratorPayload = {
        isOrchestrator: true,
        executiveSummary: unmaskedExecSummary,
        agentCards: [
          { role: "security", title: "Security Audit", content: unmaskedSecurity },
          { role: "vlan", title: "VLAN Topology", content: unmaskedVlan },
          { role: "routing", title: "Routing & NAT", content: unmaskedRouting }
        ],
        unifiedFixScript: unmaskedUnifiedFixScript
      };

      console.log('🤖 [Multi-Agent Orchestrator] Completed synthesis successfully! Payload structure:');
      console.log(`- isOrchestrator: ${orchestratorPayload.isOrchestrator}`);
      console.log(`- executiveSummary length: ${orchestratorPayload.executiveSummary ? orchestratorPayload.executiveSummary.length : 0}`);
      console.log(`- agentCards count: ${orchestratorPayload.agentCards.length}`);
      console.log(`- unifiedFixScript length: ${orchestratorPayload.unifiedFixScript ? orchestratorPayload.unifiedFixScript.length : 0}`);

      return res.json(orchestratorPayload);
    }

    // Inject custom best practice wiki context if keywords are present in chatMessage or pastedConfig
    systemPrompt = injectContext(systemPrompt || DEFAULT_SYSTEM_PROMPT, chatMessage, pastedConfig);

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

    // Parse the sections of the masked raw response to get the masked corrected config
    const { correctedConfig: maskedCorrectedConfig } = parseSections(llmRawResponse);

    // Extract the masked original config from maskedText
    const startMarker = '[ROUTEROS CONFIG / LOGS / EXPORT]:\n```\n';
    const endMarker = '\n```\n';
    let maskedOriginalConfig = '';
    if (pastedConfig) {
      const startIdx = maskedText.indexOf(startMarker);
      if (startIdx !== -1) {
        const afterStart = maskedText.substring(startIdx + startMarker.length);
        const endIdx = afterStart.indexOf(endMarker);
        if (endIdx !== -1) {
          maskedOriginalConfig = afterStart.substring(0, endIdx);
        }
      }
    }

    if (!maskedOriginalConfig && pastedConfig) {
      // Fallback: mask just the pasted config
      const { maskedText: justMaskedOriginal } = mask(pastedConfig, maskOptions);
      maskedOriginalConfig = justMaskedOriginal;
    }

    res.json({
      success: true,
      explanation,
      correctedConfig,
      fixCommands,
      maskedOriginalConfig,
      maskedCorrectedConfig,
      rawResponse: unmaskedRawResponse,
      maskedRawResponse: llmRawResponse // sent for transparency/debug
    });

  } catch (error) {
    console.error('[Error] Chat processing failed:', error);
    res.status(500).json({ error: error.message || 'An error occurred during chat processing' });
  }
});

/**
 * Endpoint: Firewall Shadow Detector Analysis
 */
app.post('/api/analyze-shadows', async (req, res) => {
  try {
    let {
      pastedConfig,
      provider,
      apiKey,
      baseUrl,
      model,
      language,
      maskOptions,
      routerOsVersion,
      hardwareModel
    } = req.body;

    if (!pastedConfig) {
      return res.status(400).json({ error: 'RouterOS configuration is required to analyze' });
    }

    // Extract only firewall and NAT sections
    const firewallSection = extractFirewallSections(pastedConfig);
    if (!firewallSection.trim()) {
      return res.status(400).json({ error: 'No /ip firewall filter or /ip firewall nat sections found in configuration.' });
    }

    // Prepare system prompt for shadow rules analysis
    const SHADOW_SYSTEM_PROMPT = `You are Mik the Winbox Wizard (or Mik for short), an authoritative, certified Senior MikroTik Network Security Expert. Your task is to analyze RouterOS firewall rule ordering and identify any "shadowed" rules (rules that will never be hit because a previous, broader rule already accepts or drops the traffic).

TONE & PERSONALITY Guidelines:
1. STRICTLY PROFESSIONAL & TECHNICAL: Remove ALL fantasy metaphors.
2. Be direct, concise, and authoritative. Speak and act like a Senior Network Engineer.
3. NEVER output conversational filler or friendly/lighthearted greetings. Get straight to the analysis.

You MUST analyze the rules and return your output in two distinct sections, wrapped in the following markers:

<<<EXPLANATION>>>
Provide a professional, technical explanation explaining why the shadowed rules occur and what the overall security or logical impact is.
<<<END_EXPLANATION>>>

<<<SHADOW_RULES>>>
Provide a valid JSON array of identified shadowed rules, matching this schema exactly:
[
  {
    "shadowedRule": "Rule details (e.g. add chain=input action=accept protocol=tcp port=22)",
    "causingRule": "Rule details (e.g. add chain=input action=drop)",
    "fix": "Move rule X above rule Y"
  }
]
If there are no shadowed rules found, return exactly an empty array: []
Do not add any Markdown formatting or backticks around the JSON array inside the <<<SHADOW_RULES>>> tags. Just pure JSON.
<<<END_SHADOW_RULES>>>

Strict Instructions:
1. You will see placeholders like [PRIV_IP_1], [PUB_IP_1], [MAC_1], [SECRET_1], [IFACE_1], [DOMAIN_1], [IDENTITY_1]. You MUST preserve these exact placeholders in your response.
2. Only identify true shadowed rules (where traffic matching the shadowed rule is guaranteed to have already been handled by a broader previous rule in the same chain). Avoid false positives.`;

    // Override or supply defaults from environment variables if set
    if (process.env.LLM_PROVIDER) {
      provider = process.env.LLM_PROVIDER;
      if (process.env.LLM_MODEL) {
        model = process.env.LLM_MODEL;
      }
      if (process.env.LLM_BASE_URL) {
        baseUrl = process.env.LLM_BASE_URL;
      }
    }

    const promptText = `Analyze this RouterOS firewall rule order. Identify any 'shadowed' rules (rules that will never be hit because a previous, broader rule already accepts or drops the traffic). Explain why and suggest the correct order.\n\n[FIREWALL RULES TO ANALYZE]:\n\`\`\`\n${firewallSection}\n\`\`\`\n`;

    // Apply the Privacy Shield masking
    console.log('🛡️ [Mik\'s Privacy Shield] Masking firewall config for shadow analysis...');
    const { maskedText, mapping } = mask(promptText, maskOptions);

    // Send to LLM
    const llmRawResponse = await callLLM({
      provider,
      apiKey,
      baseUrl,
      model,
      systemPrompt: SHADOW_SYSTEM_PROMPT,
      promptText: maskedText,
      language: language || 'auto',
      routerOsVersion,
      hardwareModel
    });

    console.log('🔮 [Mik the Winbox Wizard] Shadow analysis complete! Unmasking response...');
    const unmaskedRawResponse = unmask(llmRawResponse, mapping);

    // Parse sections
    let explanation = '';
    let shadowRulesStr = '[]';

    const expMatch = /<<<EXPLANATION>>>([\s\S]*?)<<<END_EXPLANATION>>>/i.exec(unmaskedRawResponse);
    if (expMatch) explanation = expMatch[1].trim();

    const rulesMatch = /<<<SHADOW_RULES>>>([\s\S]*?)<<<END_SHADOW_RULES>>>/i.exec(unmaskedRawResponse);
    if (rulesMatch) shadowRulesStr = rulesMatch[1].trim();

    // Fallback if formatting was ignored by LLM
    if (!explanation && !rulesMatch) {
      explanation = unmaskedRawResponse;
    }

    let shadowRules = [];
    try {
      // Clean potential JSON markdown wrapper if LLM mistakenly added it
      let cleanJson = shadowRulesStr.replace(/```json/gi, '').replace(/```/g, '').trim();
      shadowRules = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.warn('Failed to parse shadow rules JSON from LLM:', parseErr, shadowRulesStr);
    }

    res.json({
      success: true,
      explanation,
      shadowRules,
      firewallSection
    });

  } catch (error) {
    console.error('[Error] Shadow analysis failed:', error);
    res.status(500).json({ error: error.message || 'An error occurred during shadow analysis' });
  }
});

/**
 * Endpoint: Test Connection to Provider
 */
app.post('/api/test-connection', async (req, res) => {
  try {
    let { provider, apiKey, baseUrl, model } = req.body;

    // Support environmental override for connection test as well
    if (process.env.LLM_PROVIDER) {
      provider = process.env.LLM_PROVIDER;
      if (process.env.LLM_MODEL) {
        model = process.env.LLM_MODEL;
      }
      if (process.env.LLM_BASE_URL) {
        baseUrl = process.env.LLM_BASE_URL;
      }
    }

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
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🧙‍♂️ 🚀 Mik the Winbox Wizard is running at http://localhost:${PORT}`);
  });
}

module.exports = {
  extractFirewallSections,
  app
};
