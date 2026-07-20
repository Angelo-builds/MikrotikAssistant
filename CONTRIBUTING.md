# Contributing to Mik the Winbox Wizard

Thank you for your interest in contributing to **Mik the Winbox Wizard**! We are excited to collaborate with the network engineering, cybersecurity, and open-source communities to build the most secure and intuitive AI assistant for MikroTik RouterOS.

This document provides clear guidelines and instructions on how to set up the repository, add new parsing rules, enhance the local Privacy Shield masking pipeline, and verify your changes with our testing harness.

---

## 🛠️ Local Development Setup

To get started with local development:

1. **Prerequisites**: Make sure you have [Node.js](https://nodejs.org/) (v16.x or newer recommended) and `npm` installed.
2. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/MikrotikAssistant.git
   cd MikrotikAssistant
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Run the Backend Server**:
   ```bash
   npm start
   ```
   The backend server runs on port `3000` by default. You can open your browser to **http://localhost:3000** to test the frontend and live preview changes.

---

## 🛡️ Working with the Privacy Shield Pipeline

The **Privacy Shield** (`privacyShield.js`) is our local de-identification firewall. It scans configurations *before* they leave the local environment to ensure that sensitive data is masked and never leaked to LLM APIs.

The pipeline comprises six main modules:
1. **Secrets / Passwords**: Identifies WPA keys, system passwords, certificates, etc.
2. **MAC Hardware IDs**: Identifies hex hardware MAC coordinates.
3. **IP Subnets (IPv4 and IPv6)**: Separates subnets into private (internal) or public categories.
4. **System Identity**: Obfuscates customized router hostname or label.
5. **Domains / DDNS Links**: Hides external lookup domains and `.mynetname.net` DDNS names.
6. **Custom Interfaces**: Identifies custom bridges or tunnels while preserving common standard ones (like `ether1`, `bridge`) for topological context.

### 1. Adding a New Masking Rule
If you need to mask a new parameter (e.g., VPN tunnel keys or third-party API handles):
1. Open `privacyShield.js`.
2. Locate the `mask(text, options)` function.
3. Create a new regex rule or update the existing categories.
4. Set up an incrementing placeholder generator:
   ```javascript
   const myRegex = /\bmy-sensitive-property="?([^"\s]+)"?/gi;
   maskedText = maskedText.replace(myRegex, (match, rawVal) => {
     let placeholder = Object.keys(mapping.secret).find(k => mapping.secret[k] === rawVal);
     if (!placeholder) {
       placeholder = `[SECRET_${secretCounter++}]`;
       mapping.secret[placeholder] = rawVal;
     }
     return `my-sensitive-property="${placeholder}"`;
   });
   ```

### 2. Modifying Standard Interfaces Whitelist
Our engine preserves common standard interface names (e.g. `ether1`, `bridge`, `wlan1`) so that the AI understands the hardware layout, while masking custom interfaces.
To add standard interfaces that should **never** be masked:
- Edit the `BUILTIN_INTERFACES` `Set` at the top of `privacyShield.js`:
  ```javascript
  const BUILTIN_INTERFACES = new Set([
    'ether1', 'ether2', ..., 'my-new-safe-interface'
  ]);
  ```

---

## 🧪 Verifying and Testing Changes

Before committing your changes, you **must** run the local test suite to guarantee there are no regressions. Our custom-designed unit test suite tests both backend masking/restoration logic and frontend line-diffing/Markdown parsing functions.

Run the tests using the following command:
```bash
npm test
```

### Writing a New Test Case
If you added a new masking pattern or parser rule:
1. Open `test.js`.
2. Locate `runAllTests()`.
3. Add an `assert()` statement checking your new rule:
   ```javascript
   assert(maskedText.includes('[SECRET_2]'), 'Should replace custom VPN tunnel keys');
   ```
4. Verify that `npm test` outputs a complete passing result block.

---

## 🚀 Pull Request Guidelines

1. **Create a Topic Branch**: Build your changes on a dedicated feature or bugfix branch.
   ```bash
   git checkout -b feature/my-amazing-feature
   ```
2. **Write Clean Code**: Adhere to existing coding standards. Ensure variable names are clear and functions are well-documented.
3. **Do Not Edit Artifacts**: If working on dependencies, let the packager handle building them.
4. **Pass all Tests**: Ensure `npm test` runs with zero failures.
5. **Describe Your Pull Request**: Provide a clear explanation of what your pull request implements or fixes, along with testing steps.

Thank you for helping us make network auditing safer and smarter for everyone!
