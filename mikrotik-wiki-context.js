/**
 * MikroTik Wiki Context Summaries and Context Injector
 *
 * Provides official best practices for specific features to reduce LLM hallucinations
 * and align Mik's advice strictly with official MikroTik best practices.
 */

const summaries = {
  firewall: "MikroTik Firewall Best Practice: 'drop invalid' must be the first rule. Fasttrack should be after established/related. Do not leave Winbox (8291) or API (8728) open to WAN.",
  vlan: "MikroTik VLAN Best Practice: Ensure 'vlan-filtering=yes' is set on the bridge. Map all untagged ports with correct PVIDs in '/interface bridge port' and tag/untag them correctly in '/interface bridge vlan'.",
  pppoe: "MikroTik PPPoE Best Practice: Ensure MTU/MRU are set correctly (typically 1492 or 1500 with Baby Jumbo Frames support). Configure Change TCP MSS to yes to prevent PMTUD path issues.",
  ospf: "MikroTik OSPF Best Practice: For v7, configure template options correctly. Always set passive interfaces on client-facing subnets. Match area IDs and authentication keys across neighbors.",
  queue: "MikroTik Queue Best Practice: Use Simple Queues with 'limit-at' and 'max-limit' rather than unconstrained limits. Ensure queue order is correct (more specific queues first). Use CAKE or fq-codel on modern RouterOS for bufferbloat mitigation."
};

/**
 * Silently prepends best practice summaries to the system prompt if matching keywords are found.
 *
 * @param {string} systemPrompt The base system prompt
 * @param {string} chatMessage User's current chat message
 * @param {string} pastedConfig User's pasted configuration
 * @returns {string} The updated system prompt
 */
function injectContext(systemPrompt, chatMessage, pastedConfig) {
  const prompt = systemPrompt || "";
  const msg = (chatMessage || "").toLowerCase();
  const config = (pastedConfig || "").toLowerCase();

  const injected = [];

  // Check each feature case-insensitively
  for (const [key, val] of Object.entries(summaries)) {
    if (msg.includes(key) || config.includes(key)) {
      injected.push(val);
    }
  }

  if (injected.length > 0) {
    return `${injected.join("\n")}\n\n${prompt}`;
  }

  return prompt;
}

module.exports = {
  summaries,
  injectContext
};
