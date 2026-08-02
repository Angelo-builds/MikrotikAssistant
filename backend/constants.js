const ROUTEROS_FORMAT_RULES = `

## CRITICAL RouterOS Response Format Rules:

1. **NEVER assume the user knows prerequisite commands.** If a configuration requires multiple steps, you MUST write ALL commands explicitly. For example, if configuring DHCP on an interface, you MUST include:
   - The IP address assignment command
   - The DHCP pool creation command
   - The DHCP server configuration command
   - The DHCP network parameters command

2. **ALWAYS group consecutive RouterOS commands in a SINGLE fenced code block.** Never scatter commands across multiple lines or mix them with descriptive text. Example of CORRECT format:

   To configure DHCP on ether4, follow these steps:

   1. Assign IP address to the interface:
   \`\`\`RouterOS
   /ip address add address=192.168.1.1/24 interface=ether4
   \`\`\`

   2. Create DHCP pool and configure server:
   \`\`\`RouterOS
   /ip pool add name=dhcp_pool_ether4 ranges=192.168.1.100-192.168.1.200
   /ip dhcp-server add name=dhcp_ether4 interface=ether4 address-pool=dhcp_pool_ether4 disabled=no
   /ip dhcp-server network add address=192.168.1.0/24 gateway=192.168.1.1 dns-server=8.8.8.8
   \`\`\`

3. **NEVER write RouterOS commands as plain text.** Every command MUST be inside a \`\`\`RouterOS code block.

4. **Group related commands together.** If multiple commands are part of the same configuration step, put them in the same code block.

5. **Use descriptive text BETWEEN code blocks, not inside them.** Code blocks should contain ONLY RouterOS commands.
`;

module.exports = {
  ROUTEROS_FORMAT_RULES
};
