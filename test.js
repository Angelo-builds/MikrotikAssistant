const { mask, unmask, isPrivateIPv4, isPrivateIPv6 } = require('./privacyShield');
const { computeLineDiff, renderMarkdown, extractRouterOsCommands, debounce } = require('./public/utils');

function runAllTests() {
  console.log('=== STARTING INTEGRATION & UNIT TESTS ===');
  let failures = 0;

  function assert(condition, message) {
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      failures++;
    } else {
      console.log(`✅ PASS: ${message}`);
    }
  }

  // Unit Test 1: Subnet Classifications
  assert(isPrivateIPv4('192.168.88.1') === true, '192.168.88.1 should be private');
  assert(isPrivateIPv4('10.0.0.1') === true, '10.0.0.1 should be private');
  assert(isPrivateIPv4('172.16.5.20') === true, '172.16.5.20 should be private');
  assert(isPrivateIPv4('8.8.8.8') === false, '8.8.8.8 should be public');
  assert(isPrivateIPv4('203.0.113.1') === false, '203.0.113.1 should be public');

  assert(isPrivateIPv6('fe80::1') === true, 'fe80::1 should be private/local');
  assert(isPrivateIPv6('fc00::1') === true, 'fc00::1 should be private/local');
  assert(isPrivateIPv6('2001:db8::1') === false, '2001:db8::1 should be public');

  // Unit Test 2: Masking & Unmasking Pipeline with Mixed Input
  const originalInput = `
    # MikroTik Export
    /system identity set name="Core-Router"
    /ip address
    add address=192.168.1.1/24 interface=bridge-local
    add address=203.0.113.50/29 interface=ether1-wan
    /interface wireless security-profiles
    set [ find default=yes ] wpa2-pre-shared-key="SuperSecretPassword"
    /ip cloud set ddns-enabled=yes ddns-update-interval=10m
    # DDNS url: core-router.sn.mynetname.net
  `;

  const { maskedText, mapping } = mask(originalInput, {
    maskIPs: true,
    maskMACs: true,
    maskSecrets: true,
    maskInterfaces: true,
    maskDomains: true,
    maskIdentity: true
  });

  console.log('\n--- Masked Text Output ---\n', maskedText);
  console.log('-------------------------\n');

  assert(maskedText.includes('[IDENTITY_1]'), 'Should replace Core-Router identity');
  assert(maskedText.includes('[PRIV_IP_1]'), 'Should replace private IP 192.168.1.1');
  assert(maskedText.includes('[PUB_IP_1]'), 'Should replace public IP 203.0.113.50');
  assert(maskedText.includes('[SECRET_1]'), 'Should replace wireless profile security secret');
  assert(maskedText.includes('[DOMAIN_1]'), 'Should replace DDNS domain address');
  assert(maskedText.includes('[IFACE_1]'), 'Should replace custom interface bridge-local');

  // Verify de-anonymization restoration
  const restored = unmask(maskedText, mapping);
  assert(restored.trim() === originalInput.trim(), 'Restored configuration should match original input 100% exactly!');

  // Unit Test 3: LLM Formatting & Response Simulation
  const simulatedLlmResponse = `
    <<<EXPLANATION>>>
    I have updated the bridge-local IP address to use [PRIV_IP_1]/24 instead.
    Also, your wireless password [SECRET_1] is fine, and we kept the interface [IFACE_1] name intact.
    Your WAN IP [PUB_IP_1] is correct.
    <<<END_EXPLANATION>>>

    <<<CORRECTED_CONFIG>>>
    /ip address
    add address=[PRIV_IP_1]/24 interface=[IFACE_1]
    add address=[PUB_IP_1]/29 interface=ether1
    <<<END_CORRECTED_CONFIG>>>

    <<<FIX_COMMANDS>>>
    /ip address set [ find interface=[IFACE_1] ] address=[PRIV_IP_1]/24
    <<<END_FIX_COMMANDS>>>
  `;

  const restoredLlmResponse = unmask(simulatedLlmResponse, mapping);
  console.log('\n--- Restored LLM Output ---\n', restoredLlmResponse);
  console.log('--------------------------\n');

  assert(restoredLlmResponse.includes('192.168.1.1'), 'Restored explanation should contain original IP 192.168.1.1');
  assert(restoredLlmResponse.includes('SuperSecretPassword'), 'Restored explanation should contain original password');
  assert(restoredLlmResponse.includes('bridge-local'), 'Restored configuration should contain original interface name');
  assert(restoredLlmResponse.includes('203.0.113.50'), 'Restored commands should contain original public IP');

  // Unit Test 4: Frontend computeLineDiff Utility Tests
  console.log('--- Unit Test 4: computeLineDiff ---\n');
  const originalConfigDiffSample = '/ip firewall filter\nadd chain=input action=accept';
  const correctedConfigDiffSample = '/ip firewall filter\nadd chain=input action=drop\nadd chain=forward action=accept';
  const diffResult = computeLineDiff(originalConfigDiffSample, correctedConfigDiffSample);

  assert(Array.isArray(diffResult), 'computeLineDiff should return an array');
  assert(diffResult.some(r => r.type === 'modify'), 'computeLineDiff should align modifications');
  assert(diffResult.some(r => r.type === 'insert'), 'computeLineDiff should identify insertions');

  // Unit Test 5: Frontend renderMarkdown Utility Tests
  console.log('\n--- Unit Test 5: renderMarkdown ---\n');
  const markdownSample = '### Wizard Spells\n* firewall filters protect\n**Mik the Wizard** is here.\nUse `the spell` always.';
  const markdownHtml = renderMarkdown(markdownSample);

  assert(markdownHtml.includes('ml-4 list-disc'), 'renderMarkdown should render bullet lists');
  assert(markdownHtml.includes('font-semibold'), 'renderMarkdown should render bold elements');
  assert(markdownHtml.includes('font-mono text-[11px]'), 'renderMarkdown should render high-contrast inline code blocks');
  assert(markdownHtml.includes('h5 class='), 'renderMarkdown should parse headers');

  // Unit Test 6: extractRouterOsCommands
  console.log('\n--- Unit Test 6: extractRouterOsCommands ---\n');
  const markdownWithCommands = `
    Hello network wizard! Here is the plan:
    First, let's look at the firewall rules.
    \`\`\`routeros
    /ip firewall filter add chain=input action=drop comment="drop invalid"
    \`\`\`
    And we also want to add this interface to bridge:
    /interface bridge port add bridge=bridge-local interface=ether2
    Let me know if this works!
  `;
  const extracted = extractRouterOsCommands(markdownWithCommands);
  console.log('Extracted commands:\n', extracted);
  assert(extracted.includes('/ip firewall filter add chain=input action=drop comment="drop invalid"'), 'Should extract firewall command');
  assert(extracted.includes('/interface bridge port add bridge=bridge-local interface=ether2'), 'Should extract interface command');
  assert(!extracted.includes('Hello network wizard'), 'Should not contain conversational text');
  assert(!extracted.includes('And we also want to add'), 'Should not contain conversational text');

  // Unit Test 7: VLAN Config Parsing
  console.log('\n--- Unit Test 7: parseVlanConfig ---\n');
  const { parseVlanConfig, generateVlanMermaidGraph } = require('./public/utils');
  const vlanConfigSample = `
    /interface bridge vlan
    add bridge=br-lan tagged=ether1,ether2 untagged=ether3 vlan-ids=10
    add bridge=br-lan tagged=ether1 untagged=ether4 vlan-ids=20,30
    /interface bridge port
    add bridge=br-lan interface=ether5 pvid=40
    /interface vlan
    add interface=br-lan name=vlan-mgmt vlan-id=99
  `;
  const parsedVlans = parseVlanConfig(vlanConfigSample);
  console.log('Parsed VLANs:', JSON.stringify(parsedVlans, null, 2));

  assert(Array.isArray(parsedVlans), 'parseVlanConfig should return an array');
  assert(parsedVlans.length > 0, 'parseVlanConfig should find elements');

  const vlan10 = parsedVlans.find(v => v.vlanId === 10 && v.bridge === 'br-lan');
  assert(!!vlan10, 'Should find vlan 10 entry');
  assert(vlan10.ports.includes('ether1 (tagged)'), 'Vlan 10 should contain ether1 (tagged)');
  assert(vlan10.ports.includes('ether3 (untagged)'), 'Vlan 10 should contain ether3 (untagged)');

  const vlan20 = parsedVlans.find(v => v.vlanId === 20);
  assert(!!vlan20, 'Should parse multiple/list vlan-ids (20)');
  assert(vlan20.ports.includes('ether1 (tagged)'), 'Vlan 20 should contain ether1 (tagged)');

  const vlan40 = parsedVlans.find(v => v.vlanId === 40);
  assert(!!vlan40, 'Should extract from bridge port section (vlan 40)');
  assert(vlan40.ports.includes('ether5 (untagged/pvid)'), 'Vlan 40 should contain ether5');

  const vlan99 = parsedVlans.find(v => v.vlanId === 99);
  assert(!!vlan99, 'Should parse /interface vlan interface entries (vlan 99)');
  assert(vlan99.ports.includes('vlan-mgmt (vlan-interface)'), 'Vlan 99 should contain vlan-mgmt');

  // Unit Test 8: VLAN Mermaid Graph Generation
  console.log('\n--- Unit Test 8: generateVlanMermaidGraph ---\n');
  const mermaidGraphCode = generateVlanMermaidGraph(parsedVlans);
  console.log('Generated Mermaid graph:\n', mermaidGraphCode);
  assert(mermaidGraphCode.includes('graph TD'), 'Should start with graph TD');
  assert(mermaidGraphCode.includes('classDef bridgeStyle'), 'Should define bridge styling');
  assert(mermaidGraphCode.includes('bridge_br_lan["🌉 Bridge: br-lan"]'), 'Should define br-lan node');
  assert(mermaidGraphCode.includes('vlan_bridge_br_lan_10["🏷️ VLAN 10"]'), 'Should define vlan 10 node');

  // Unit Test 9: Context Injector Verification
  console.log('\n--- Unit Test 9: injectContext ---\n');
  const { injectContext, summaries } = require('./mikrotik-wiki-context');
  const basePrompt = "Original System Prompt";

  // Test 9a: No keywords matched
  const resNoMatch = injectContext(basePrompt, "no match", "no match config");
  assert(resNoMatch === basePrompt, "Should return original system prompt when no keywords match");

  // Test 9b: Case-insensitive match on single keyword (firewall)
  const resFirewall = injectContext(basePrompt, "FiReWaLl config help", "other config");
  assert(resFirewall.includes(summaries.firewall), "Should inject firewall summary when keyword 'firewall' is present case-insensitively");
  assert(resFirewall.endsWith(basePrompt), "Injected prompt should end with the original prompt");

  // Test 9c: Multiple keywords matched (vlan and queue)
  const resMulti = injectContext(basePrompt, "set up a VLAN", "simple queue configuration");
  assert(resMulti.includes(summaries.vlan), "Should inject vlan summary");
  assert(resMulti.includes(summaries.queue), "Should inject queue summary");
  assert(resMulti.includes(summaries.vlan) && resMulti.includes(summaries.queue), "Should inject both summaries");

  // Test 9d: Graceful handling of undefined/null inputs
  const resNull = injectContext(null, null, null);
  assert(resNull === "", "Should return empty string if no keywords match and systemPrompt is null");

  const resNullWithKeyword = injectContext(null, "use OSPF", null);
  assert(resNullWithKeyword.includes(summaries.ospf), "Should inject OSPF summary even if systemPrompt and pastedConfig are null");

  console.log('\n=======================================');
  if (failures === 0) {
    console.log('🎉 ALL INTEGRATION & UNIT TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('=======================================\n');
    process.exit(0);
  } else {
    console.error(`💥 ${failures} TESTS FAILED! 💥`);
    console.log('=======================================\n');
    process.exit(1);
  }
}

runAllTests();
