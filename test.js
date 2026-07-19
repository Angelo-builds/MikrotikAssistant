const { mask, unmask, isPrivateIPv4, isPrivateIPv6 } = require('./privacyShield');
const app = require('./src/app');
const http = require('http');

async function runAllTests() {
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

  // Integration Test 4: Booting Server and testing API validation, security headers, rate limiting, and CORS
  console.log('\n--- Running API Integration Tests on Test Port ---');
  const TEST_PORT = 3005;
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  const baseUrl = `http://localhost:${TEST_PORT}`;

  try {
    // A. Verify Security Headers
    const rootRes = await fetch(`${baseUrl}/`);
    assert(rootRes.headers.get('X-Content-Type-Options') === 'nosniff', 'Security header: X-Content-Type-Options should be nosniff');
    assert(rootRes.headers.get('X-Frame-Options') === 'DENY', 'Security header: X-Frame-Options should be DENY');
    assert(rootRes.headers.get('X-XSS-Protection') === '1; mode=block', 'Security header: X-XSS-Protection should be block');
    assert(rootRes.headers.get('Content-Security-Policy') !== null, 'Security header: Content-Security-Policy should be present');

    // B. Verify Centralized 404 Error Handler Formatting
    const nonExistentRes = await fetch(`${baseUrl}/api/some-dead-spell`);
    assert(nonExistentRes.status === 404, 'Centralized Error Handler: Non-existent endpoints should return 404');
    const nonExistentData = await nonExistentRes.json();
    assert(nonExistentData.error === 'Not Found', 'Centralized Error Handler: Should return Not Found error key');
    assert(nonExistentData.message && nonExistentData.message.includes('Resource not found'), 'Centralized Error Handler: Should include route message');

    // C. Verify Input Validation for Chat API (Missing Provider)
    const badValRes1 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pastedConfig: '/ip address',
        chatMessage: 'Check this config'
        // Missing provider
      })
    });
    assert(badValRes1.status === 400, 'Validator: Missing provider should result in 400 Bad Request');
    const badValData1 = await badValRes1.json();
    assert(badValData1.message.includes('Provider is required'), 'Validator: Should indicate Provider is required');

    // D. Verify Input Validation for Chat API (Missing Inputs)
    const badValRes2 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'openai'
        // Missing chatMessage & pastedConfig
      })
    });
    assert(badValRes2.status === 400, 'Validator: Missing both message and config should result in 400');
    const badValData2 = await badValRes2.json();
    assert(badValData2.message.includes('Either chatMessage or pastedConfig is required'), 'Validator: Should require input fields');

    // E. Verify Input Validation for Chat API (Missing API Key for Cloud Provider)
    const badValRes3 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'openai',
        chatMessage: 'Verify WAN safety',
        pastedConfig: '/ip firewall'
        // Missing apiKey
      })
    });
    assert(badValRes3.status === 400, 'Validator: Missing API Key for cloud provider should result in 400');
    const badValData3 = await badValRes3.json();
    assert(badValData3.message.includes('API Key is required'), 'Validator: Should require cloud API Key');

    // F. Verify Input Validation for Chat API (Too large payload config)
    const hugeConfig = 'X'.repeat(600 * 1024); // 600 KB
    const badValRes4 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'ollama',
        chatMessage: 'Verify large config',
        pastedConfig: hugeConfig
      })
    });
    assert(badValRes4.status === 400, 'Validator: Exceeding 500KB config limit should result in 400');
    const badValData4 = await badValRes4.json();
    assert(badValData4.message.includes('exceeds the maximum limit'), 'Validator: Should refuse overly large payloads');

    // G. Verify Input Validation for Test Connection API (Invalid Provider)
    const testConnRes1 = await fetch(`${baseUrl}/api/test-connection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'spellcast-wizard-cloud'
      })
    });
    assert(testConnRes1.status === 400, 'Validator: Invalid test provider should result in 400');

    // H. Verify Rate Limiter
    // Since our main limiter on the app is set to 100 requests per 15 minutes,
    // let's create a targeted test with a fast-rate limiter or simply call the API repeatedly to verify.
    // Wait, let's verify our limiter logic unit-wise or test it.
    const createRateLimiter = require('./src/middleware/rateLimiter');
    let rateLimiterTriggered = false;
    const testLimiter = createRateLimiter({ windowMs: 50, maxRequests: 2 });
    const mockReq = { headers: {}, socket: { remoteAddress: '1.2.3.4' } };
    const mockRes = {
      status: (code) => {
        if (code === 429) rateLimiterTriggered = true;
        return { json: () => {} };
      }
    };
    let nextCount = 0;
    const mockNext = () => { nextCount++; };

    testLimiter(mockReq, mockRes, mockNext); // Req 1: allowed
    testLimiter(mockReq, mockRes, mockNext); // Req 2: allowed
    testLimiter(mockReq, mockRes, mockNext); // Req 3: blocked (triggered status 429)

    assert(nextCount === 2, 'Rate Limiter: Next should only be called twice');
    assert(rateLimiterTriggered === true, 'Rate Limiter: Request limit should trigger 429 response');

  } catch (err) {
    console.error('Integration test flow error:', err);
    failures++;
  } finally {
    // Close the test server cleanly
    await new Promise((resolve) => server.close(resolve));
    console.log('--- Test Server Shut Down Cleanly ---');
  }

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
