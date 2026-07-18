# MikroTik Privacy AI Chatbot Assistant (MikrotikAssistant)

An elite AI-powered chatbot and auditing assistant specifically designed for MikroTik RouterOS (v6 & v7) networks, featuring **Extreme Local Privacy Shielding**.

The assistant processes RouterOS configuration exports, console logs, or network issues, detects syntax/logical configuration bugs, and provides a clear Explanation, a side-by-side Configuration Diff, and copy-pasteable CLI commands to fix them.

All sensitive data—including passwords, private/public IP addresses, MAC addresses, custom interfaces, domains, and router identities—is masked **entirely locally in the browser/node proxy context** before being transmitted to third-party LLMs. It is then seamlessly restored when the response returns, keeping your network credentials and secrets completely confidential.

---

## Key Features

- **Extreme Privacy Shield:** Local regex-based de-anonymization engine masks:
  - Private & Public IPv4/IPv6 addresses
  - Physical hardware MAC addresses
  - Wireless security keys, passwords, and sensitive credentials
  - Custom interface names (while retaining standard context like `ether1` or `bridge`)
  - Cloud DDNS names and domains
  - Router system identity setting names
- **Custom Side-by-Side Configuration Diff:** Instantly view redline comparison of original configurations (displaying redacted placeholders) versus the corrected configuration (with your private network details fully restored!).
- **Copy-and-Paste Fix Commands:** Copy ready-to-run RouterOS CLI terminal commands directly to your clipboard to execute directly on your router.
- **Multiple LLM Provider Support:** Integrates with OpenAI (GPT-4o/mini), Anthropic (Claude), OpenRouter, local Ollama, or any custom LAN OpenAI-compatible API endpoints.
- **Secure Key Storage:** Your API keys and configuration preferences are saved securely in browser `localStorage` and never stored on the server.

---

## Project Structure

```text
MikrotikAssistant/
├── public/
│   ├── index.html        # Single Page Tailwind CSS Frontend UI
│   └── app.js            # Main Frontend Javascript (Diff engine, settings & API handlers)
├── server.js             # Express.js backend CORS proxy
├── privacyShield.js      # Robust masking & restoration engine
├── test.js               # Unit & integration test suite
├── package.json          # Dependencies & scripts
└── README.md             # This file
```

---

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or newer recommended)

### Step 1: Install Dependencies

Clone this repository and install the minimal required dependencies:

```bash
npm install
```

### Step 2: Start the Application

Run the Express.js proxy server locally:

```bash
npm start
```

The application will launch and be available at: **[http://localhost:3000](http://localhost:3000)**.

---

## How to Run Tests

A custom lightweight, dependency-free test runner (`test.js`) is included to verify the Privacy Shield pipeline, subnet classification logic, masking precision, and response restoration capabilities without installing heavy devDependencies.

To run the unit and integration tests:

```bash
npm test
```

---

## Privacy Shield Pipeline Architecture

```text
[User Config/Query Input]
          │
          ▼
   [Local Node Proxy] ──(Extracts & Redacts Secrets/IPs/MACs)──► [Generates Mapping Dictionary]
          │                                                                     │
          ▼ (Sends Redacted Query)                                              │
    [Third Party LLM]                                                           │
          │                                                                     │
          ▼ (Receives Redacted Fixes)                                           │
   [Local Node Proxy] ◄──(Seamlessly Restores Network Values)───────────────────┘
          │
          ▼
 [Displaying Explanation, Diff & Restored Commands]
```

1. **Masking (Anonymization):** The chatbot scans configuration strings or user messages for patterns matching IPs, MACs, credentials, identity, custom interfaces, or domain names. It assigns dynamic placeholders like `[PRIV_IP_1]`, `[SECRET_1]`, etc., and logs the original value in an in-memory mapping dictionary.
2. **LLM Query Execution:** The redacted text is combined with an elite MikroTik RouterOS system prompt and sent to your configured LLM provider.
3. **De-anonymization (Restoration):** Once the LLM generates the response, the node proxy replaces the placeholders back with the exact original parameters, maintaining full privacy from LLM providers.

---

## License

This project is open-source and free to use.
