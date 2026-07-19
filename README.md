# Mik the Winbox Wizard — MikroTik Privacy AI Chatbot Assistant

An elite, witty, and wizard-themed AI-powered chatbot and auditing assistant specifically designed for MikroTik RouterOS (v6 & v7) networks, featuring **Extreme Local Privacy Shielding** and a **Next-Gen Cyber WinBox UI**!

---

## 🧙‍♂️ Who is Mik?

**Mik the Winbox Wizard** is your friendly, certified MikroTik network engineer, RouterOS expert, and packet-filtering wizard. He explains complex networking topics with a humorous wizard persona—referring to firewall rules as "protective wards," routing tables as "ancient maps," and configurations as "spells."

Despite his lighthearted theme, his advice is professional, accurate, and completely aligned with the latest RouterOS syntax.

---

## 🛡️ Privacy Shield Architecture

To prevent third-party LLM providers from accessing your secure network context, all audits are pre-processed by a local privacy shield **completely inside your browser and the local Node proxy**:

```text
[User Config / Query Input]
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

### What gets masked?
1. **IP Addresses:** Maps IPv4 & IPv6 subnets to `[PRIV_IP_x]` & `[PUB_IP_x]` placeholders.
2. **MAC Hardware IDs:** Masks physical hex hardware addresses to `[MAC_x]`.
3. **Secrets & Keys:** Stips passwords, wireless pre-shared keys (WPA/WPA2), PINs, and credentials.
4. **Custom Interface Names:** Identifies and redacts bridge or custom names to `[IFACE_x]`, while retaining standard RouterOS interfaces (like `ether1` or `wlan1`) for network topology context.
5. **Domains & DDNS:** Redacts dynamic DNS links and domain addresses.
6. **Router Identity:** Obfuscates `/system identity` custom names.

All placeholders are restored on-the-fly when Mik's explanation returns!

---

## 🌟 Next-Gen Cyber WinBox UI Features

Our frontend features a premium, sleek **Cyber WinBox Neon Dark Theme** containing:

- **Vertical Slim Sidebar:** Quick actions for session history, file uploads, and wizard help.
- **Session History Drawer:** Saves your previous audits in `localStorage` with real-time search filtering and custom titles.
- **Drag & Drop Upload Zone:** Effortlessly drop `.rsc`, `.txt`, or `.log` exports directly into the editor.
- **Multilingual Support:** Select English 🇬🇧 or Italiano 🇮🇹 in the header for full UI translation.
- **Dynamic LLM Language Support:**
  - **Auto-Detect:** Automatically responds inside the `<<<EXPLANATION>>>` block in the same language as your question/log.
  - **English / Italian:** Force Mik's explanations to be rendered in your preferred language.
  - *All RouterOS configurations and CLI commands always remain in standard English RouterOS terminal syntax.*
- **Interactive checklist CLI commands:** Check off applied CLI commands with dynamic line-through strikes and copy buttons, or view raw terminal commands.
- **Split & Unified comparison toggles:** Toggle between unified red/green line comparisons or a classic WinBox side-by-side split view.
- **Progressive Privacy Stepper:** Visual step-by-step progress showing credential scrubbing, AI transit, de-anonymization, and rendering.
- **Floating Toast System:** Clean non-intrusive notifications for success and error tracking.

---

## 📂 Project Structure

```text
MikrotikAssistant/
├── public/
│   ├── index.html        # Single Page Tailwind CSS Frontend UI (Cyber WinBox layout)
│   └── app.js            # Main Frontend Javascript (Localization, diff engines & history)
├── server.js             # Express.js backend CORS proxy & system prompt injector
├── privacyShield.js      # Robust regex masking & restoration engine
├── test.js               # Unit & integration test suite
├── package.json          # Dependencies & scripts
└── README.md             # This comprehensive guide
```

---

## 🚀 Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or newer recommended)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the dev server
```bash
npm start
```
The application will launch and be available at: **[http://localhost:3000](http://localhost:3000)**.

---

## 🧪 Running Tests

A lightweight, custom test suite is included to verify the Privacy Shield pipeline, masking precision, and response restoration capabilities without heavy dependency footprints:

```bash
npm test
```

---

## ⚖️ License

This project is open-source and free to use. Made with 🧙‍♂️ magic by Mik the Winbox Wizard.
