import os
import sys
import json
import time
from playwright.sync_api import sync_playwright

# Create docs/screenshots/ directory if it doesn't exist
os.makedirs("docs/screenshots", exist_ok=True)

APP_URL = "http://localhost:3000"

# Sample data for programmatically injecting realistic state
MOCK_CHAT_HISTORY = [
  {
    "id": "mock-session-123",
    "title": "Audit Sicurezza Firewall",
    "timestamp": "10:30 AM",
    "messages": [
      {
        "chatMessage": "Analizza questa configurazione per vulnerabilità firewall",
        "pastedConfig": "/ip firewall filter\nadd action=accept chain=input comment=\"defconf: accept established,related\" connection-state=established,related\nadd action=drop chain=input comment=\"defconf: drop invalid\" connection-state=invalid\nadd action=accept chain=input protocol=icmp\nadd action=drop chain=input comment=\"defconf: drop WAN access\" in-interface=ether1\nadd action=accept chain=forward comment=\"defconf: accept in-interface=ether1\" in-interface=ether1",
        "result": {
          "isOrchestrator": False,
          "explanation": "Ho eseguito un'analisi della sicurezza del tuo firewall RouterOS.\n\n## Critical Issues Found\n1. **Permissive Forwarding**: La regola forwarding accetta tutto il traffico proveniente da `ether1` senza filtraggio.\n2. **Missing Out-Interface Drop**: Non c'è una regola di drop finale che blocchi il resto del traffico sulla catena di `input`.\n\n## Configuration Fixes\nSi raccomanda di sostituire la regola forward con una basata su interfacce LAN/WAN fidate e aggiungere la regola di drop finale.\n\n## Verification Commands\nUsa questi comandi per verificare lo stato:\n`/ip firewall filter print detail`",
          "fixCommands": "/ip firewall filter\nadd action=drop chain=input comment=\"drop all else\"\nset [ find comment=\"defconf: accept in-interface=ether1\" ] action=drop",
          "correctedConfig": "/ip firewall filter\nadd action=accept chain=input comment=\"defconf: accept established,related\" connection-state=established,related\nadd action=drop chain=input comment=\"defconf: drop invalid\" connection-state=invalid\nadd action=accept chain=input protocol=icmp\nadd action=drop chain=input comment=\"defconf: drop WAN access\" in-interface=ether1\nadd action=drop chain=input comment=\"drop all else\"\nadd action=drop chain=forward comment=\"defconf: accept in-interface=ether1\" in-interface=ether1"
        }
      }
    ]
  }
]

MOCK_ORCHESTRATOR_HISTORY = [
  {
    "id": "mock-session-orch",
    "title": "Orchestrator Deep Dive",
    "timestamp": "10:45 AM",
    "messages": [
      {
        "chatMessage": "Analizza questa configurazione per vulnerabilità firewall",
        "pastedConfig": "/ip firewall filter\nadd action=accept chain=input comment=\"defconf: accept established,related\" connection-state=established,related\nadd action=drop chain=input comment=\"defconf: drop invalid\" connection-state=invalid\nadd action=accept chain=input protocol=icmp\nadd action=drop chain=input comment=\"defconf: drop WAN access\" in-interface-list=WAN",
        "result": {
          "isOrchestrator": True,
          "executiveSummary": "L'analisi orchestrata multi-agente ha rilevato vulnerabilità critiche nel firewall, nella configurazione VLAN e nel routing WAN.",
          "agentCards": [
            {
              "role": "security",
              "title": "🛡️ Security Specialist",
              "content": "- **Drop finale mancante**: Nessuna regola di drop in fondo alla catena input.\n- **Invalid Drop**: La regola 'drop invalid' è posizionata correttamente ma può essere ottimizzata."
            },
            {
              "role": "vlan",
              "title": "🔌 VLAN Specialist",
              "content": "- **VLAN Filtering disattivato**: Il bridge locale ha `vlan-filtering=no`. Le VLAN configurate non sono isolate.\n- **PVID non associati**: Mancano le associazioni corrette sui trunk port."
            },
            {
              "role": "routing",
              "title": "🌐 Routing Specialist",
              "content": "- **Redundancy NAT**: Trovata regola mascherata WAN ridondante.\n- **FastPath Conflict**: FastPath abilitato che potrebbe bypassare le code IP."
            }
          ],
          "unifiedFixScript": "/ip firewall filter\nadd action=drop chain=input comment=\"drop all else\"\n/interface bridge set [ find name=bridge ] vlan-filtering=yes",
          "correctedConfig": "/ip firewall filter\nadd action=accept chain=input comment=\"defconf: accept established,related\" connection-state=established,related\nadd action=drop chain=input comment=\"defconf: drop invalid\" connection-state=invalid\nadd action=accept chain=input protocol=icmp\nadd action=drop chain=input comment=\"defconf: drop WAN access\" in-interface-list=WAN\nadd action=drop chain=input comment=\"drop all else\"\n/interface bridge set [ find name=bridge ] vlan-filtering=yes"
        }
      }
    ]
  }
]

MOCK_BUILDER_PROJECTS = [
  {
    "id": "mock-project-1",
    "name": "Cliente ABC - EOLO",
    "lastModified": 1793782400000,
    "variables": {
      "PUBLIC_NETWORK": "212.124.179.56/29",
      "LAN_NETWORK": "192.168.88.0/24",
      "HOSTNAME": "Mikrotik-Router",
      "WAN_INTERFACE": "ether1",
      "LAN_BRIDGE": "bridge-lan"
    },
    "blocks": [
      {
        "id": "bridge-lan",
        "name": "Interfaces & Bridge",
        "category": "network",
        "enabled": True,
        "content": "/interface bridge\\nadd name={{LAN_BRIDGE}} vlan-filtering=yes\\n/interface bridge port\\nadd bridge={{LAN_BRIDGE}} interface=ether2\\nadd bridge={{LAN_BRIDGE}} interface=ether3"
      },
      {
        "id": "firewall-base",
        "name": "Basic Firewall",
        "category": "security",
        "enabled": True,
        "content": "/ip firewall filter\\nadd action=accept chain=input connection-state=established,related\\nadd action=drop chain=input connection-state=invalid\\nadd action=accept chain=input protocol=icmp\\nadd action=drop chain=input in-interface={{WAN_INTERFACE}}"
      },
      {
        "id": "nat",
        "name": "NAT Masquerade",
        "category": "security",
        "enabled": True,
        "content": "/ip firewall nat\\nadd action=masquerade chain=srcnat out-interface={{WAN_INTERFACE}}"
      }
    ]
  },
  {
    "id": "mock-project-2",
    "name": "Router Casa - Fiber",
    "lastModified": 1793696000000,
    "variables": {
      "PUBLIC_NETWORK": "auto",
      "LAN_NETWORK": "192.168.1.0/24",
      "HOSTNAME": "Home-Core-Gateway",
      "WAN_INTERFACE": "ether1",
      "LAN_BRIDGE": "bridge"
    },
    "blocks": []
  },
  {
    "id": "mock-project-3",
    "name": "Ufficio Milano - VLAN",
    "lastModified": 1793522400000,
    "variables": {},
    "blocks": []
  }
]

MOCK_BUILD_TAB_VARIABLES = {
    "PUBLIC_NETWORK": "212.124.179.56/29",
    "LAN_NETWORK": "192.168.88.0/24",
    "HOSTNAME": "Mikrotik-Router",
    "WAN_INTERFACE": "ether1",
    "LAN_BRIDGE": "bridge-lan"
}

MOCK_BUILD_TAB_BLOCKS = [
    {
        "id": "block-sys-identity",
        "name": "System Identity",
        "category": "general",
        "enabled": True,
        "content": "/system identity set name={{HOSTNAME}}"
    },
    {
        "id": "block-int-bridge",
        "name": "Interfaces & Bridge",
        "category": "network",
        "enabled": True,
        "content": "/interface bridge\\nadd name={{LAN_BRIDGE}} vlan-filtering=yes\\n/interface bridge port\\nadd bridge={{LAN_BRIDGE}} interface=ether2\\nadd bridge={{LAN_BRIDGE}} interface=ether3"
    },
    {
        "id": "block-ip-address",
        "name": "IP Addresses",
        "category": "network",
        "enabled": True,
        "content": "/ip address\\nadd address={{PUBLIC_NETWORK}} interface={{WAN_INTERFACE}}\\nadd address={{LAN_NETWORK}} interface={{LAN_BRIDGE}}"
    },
    {
        "id": "block-dhcp-server",
        "name": "DHCP Server",
        "category": "services",
        "enabled": True,
        "content": "/ip pool\\nadd name=dhcp-pool ranges=192.168.88.10-192.168.88.254\\n/ip dhcp-server\\nadd address-pool=dhcp-pool interface={{LAN_BRIDGE}} name=dhcp-lan\\n/ip dhcp-server network\\nadd address=192.168.88.0/24 gateway=192.168.88.1"
    },
    {
        "id": "block-nat-masq",
        "name": "NAT Masquerade",
        "category": "security",
        "enabled": True,
        "content": "/ip firewall nat\\nadd action=masquerade chain=srcnat out-interface={{WAN_INTERFACE}}"
    },
    {
        "id": "block-basic-fw",
        "name": "Basic Firewall",
        "category": "security",
        "enabled": True,
        "content": "/ip firewall filter\\nadd action=accept chain=input connection-state=established,related\\nadd action=drop chain=input connection-state=invalid\\nadd action=accept chain=input protocol=icmp\\nadd action=drop chain=input in-interface={{WAN_INTERFACE}}"
    }
]

def setup_page_state(page, theme='dark'):
    # Clear and set theme
    page.evaluate("([k, v]) => localStorage.setItem(k, v)", ["mikrotik-assistant-theme", theme])
    page.evaluate("t => document.documentElement.setAttribute('data-theme', t)", theme)

    # Set mock states
    page.evaluate("([k, v]) => localStorage.setItem(k, v)", ["mikrotik_chatbot_history", json.dumps(MOCK_CHAT_HISTORY)])
    page.evaluate("([k, v]) => localStorage.setItem(k, v)", ["builder-projects", json.dumps(MOCK_BUILDER_PROJECTS)])
    page.evaluate("([k, v]) => localStorage.setItem(k, v)", ["right-panel-open", "true"])

    # Force stateful mock vars directly into the AppState / Router context
    page.evaluate("""
        (t) => {
            if (typeof AppState !== 'undefined') {
                AppState.theme = t;
                AppState.preferences.llmProvider = 'openrouter';
                AppState.sessionApiKey = 'sk-or-mock-api-key-just-for-screenshot-visual-purposes';
                AppState.preferences.model = 'meta-llama/llama-3-8b-instruct:free';
                AppState.save();
            }
        }
    """, theme)

def capture_hero_views(page):
    print("Capturing Hero Views...")
    # Setup standard Dark Mode
    setup_page_state(page, 'dark')
    page.evaluate("AppState.setCurrentTab('audit')")
    page.evaluate("Router.renderCurrentTab()")
    page.evaluate("Sidebar.init()")

    # Close session history control center for a cleaner Hero screenshot
    page.evaluate("localStorage.setItem('right-panel-open', 'false')")
    page.evaluate("Sidebar.isCollapsed = false")
    page.evaluate("Sidebar.render(document.getElementById('sidebar-container'))")
    page.evaluate("Router.renderCurrentTab()")
    page.wait_for_timeout(1000)

    # Screen 1.1: hero-dark.png
    page.screenshot(path="docs/screenshots/hero-dark.png")
    print("Captured docs/screenshots/hero-dark.png")

    # Switch to Light Theme
    setup_page_state(page, 'light')
    page.evaluate("AppState.setCurrentTab('audit')")
    page.evaluate("Router.renderCurrentTab()")
    page.evaluate("Sidebar.init()")
    page.evaluate("Sidebar.isCollapsed = false")
    page.evaluate("Sidebar.render(document.getElementById('sidebar-container'))")
    page.evaluate("Router.renderCurrentTab()")
    page.wait_for_timeout(1000)

    # Screen 1.2: hero-light.png
    page.screenshot(path="docs/screenshots/hero-light.png")
    print("Captured docs/screenshots/hero-light.png")

def capture_active_chat_views(page):
    print("Capturing Active Chat Views...")
    # Setup Dark Theme
    setup_page_state(page, 'dark')
    page.evaluate("AppState.setCurrentTab('audit')")
    page.evaluate("localStorage.setItem('right-panel-open', 'true')")
    page.evaluate("Router.renderCurrentTab()")
    page.evaluate("Sidebar.init()")

    # Restore the first saved conversation
    page.evaluate("""
        const history = JSON.parse(localStorage.getItem('mikrotik_chatbot_history'));
        if (history && history.length > 0) {
            AuditTab.restoreConversation(history[0]);
        }
    """)
    page.wait_for_timeout(1000)

    # Screen 2.1: audit-chat-dark.png
    page.screenshot(path="docs/screenshots/audit-chat-dark.png")
    print("Captured docs/screenshots/audit-chat-dark.png")

    # Setup Light Theme
    setup_page_state(page, 'light')
    page.evaluate("AppState.setCurrentTab('audit')")
    page.evaluate("localStorage.setItem('right-panel-open', 'true')")
    page.evaluate("Router.renderCurrentTab()")
    page.evaluate("Sidebar.init()")
    page.evaluate("""
        const history = JSON.parse(localStorage.getItem('mikrotik_chatbot_history'));
        if (history && history.length > 0) {
            AuditTab.restoreConversation(history[0]);
        }
    """)
    page.wait_for_timeout(1000)

    # Screen 2.2: audit-chat-light.png
    page.screenshot(path="docs/screenshots/audit-chat-light.png")
    print("Captured docs/screenshots/audit-chat-light.png")

def capture_multi_agent_views(page):
    print("Capturing Multi-Agent Orchestrator Views...")
    # Setup Dark Theme
    setup_page_state(page, 'dark')
    page.evaluate("([k, v]) => localStorage.setItem(k, v)", ["mikrotik_chatbot_history", json.dumps(MOCK_ORCHESTRATOR_HISTORY)])
    page.evaluate("AppState.setCurrentTab('audit')")
    page.evaluate("localStorage.setItem('right-panel-open', 'true')")
    page.evaluate("Router.renderCurrentTab()")
    page.evaluate("Sidebar.init()")

    # Restore the multi-agent/orchestrator conversation
    page.evaluate("""
        const history = JSON.parse(localStorage.getItem('mikrotik_chatbot_history'));
        const orchSession = history.find(h => h.id === 'mock-session-orch');
        if (orchSession) {
            AuditTab.restoreConversation(orchSession);
        }
    """)
    page.wait_for_timeout(1000)

    # Screen 8.1: multi-agent-dark.png
    page.screenshot(path="docs/screenshots/multi-agent-dark.png")
    print("Captured docs/screenshots/multi-agent-dark.png")

    # Setup Light Theme
    setup_page_state(page, 'light')
    page.evaluate("AppState.setCurrentTab('audit')")
    page.evaluate("localStorage.setItem('right-panel-open', 'true')")
    page.evaluate("Router.renderCurrentTab()")
    page.evaluate("Sidebar.init()")
    page.evaluate("""
        const history = JSON.parse(localStorage.getItem('mikrotik_chatbot_history'));
        const orchSession = history.find(h => h.id === 'mock-session-orch');
        if (orchSession) {
            AuditTab.restoreConversation(orchSession);
        }
    """)
    page.wait_for_timeout(1000)

    # Screen 8.2: multi-agent-light.png
    page.screenshot(path="docs/screenshots/multi-agent-light.png")
    print("Captured docs/screenshots/multi-agent-light.png")

def capture_builder_views(page):
    print("Capturing Configuration Builder Views...")
    # Dark Mode
    setup_page_state(page, 'dark')
    page.evaluate("AppState.setCurrentTab('build')")
    page.evaluate("Router.renderCurrentTab()")

    # Inject variables and blocks programmatically to BuilderEngine
    page.evaluate("""
        ([vars, blocks]) => {
            if (typeof BuilderEngine !== 'undefined') {
                BuilderEngine.state.variables = vars;
                BuilderEngine.state.blocks = blocks;
                BuilderEngine.computeAllDerived();
                if (typeof BuildTab !== 'undefined') {
                    BuildTab.renderVariables();
                    BuildTab.renderBlocks();
                    BuildTab.updatePreview();
                }
            }
        }
    """, [MOCK_BUILD_TAB_VARIABLES, MOCK_BUILD_TAB_BLOCKS])
    page.wait_for_timeout(1000)

    # Screen 3.1: builder-dark.png
    page.screenshot(path="docs/screenshots/builder-dark.png")
    print("Captured docs/screenshots/builder-dark.png")

    # Light Mode
    setup_page_state(page, 'light')
    page.evaluate("AppState.setCurrentTab('build')")
    page.evaluate("Router.renderCurrentTab()")
    page.evaluate("""
        ([vars, blocks]) => {
            if (typeof BuilderEngine !== 'undefined') {
                BuilderEngine.state.variables = vars;
                BuilderEngine.state.blocks = blocks;
                BuilderEngine.computeAllDerived();
                if (typeof BuildTab !== 'undefined') {
                    BuildTab.renderVariables();
                    BuildTab.renderBlocks();
                    BuildTab.updatePreview();
                }
            }
        }
    """, [MOCK_BUILD_TAB_VARIABLES, MOCK_BUILD_TAB_BLOCKS])
    page.wait_for_timeout(1000)

    # Screen 3.2: builder-light.png
    page.screenshot(path="docs/screenshots/builder-light.png")
    print("Captured docs/screenshots/builder-light.png")

def capture_library_views(page):
    print("Capturing Template Library Views...")
    # Dark Mode
    setup_page_state(page, 'dark')
    page.evaluate("AppState.setCurrentTab('lib')")
    page.evaluate("Router.renderCurrentTab()")

    # Expand presets and library sections for rich documentation screenshots
    page.evaluate("""
        if (typeof LibTab !== 'undefined') {
            LibTab.state.presetsExpanded = true;
            LibTab.state.libraryExpanded = true;
            const mainContent = document.getElementById('main-content');
            LibTab.render(mainContent);
        }
    """)
    page.wait_for_timeout(1000)

    # Screen 4.1: library-dark.png
    page.screenshot(path="docs/screenshots/library-dark.png")
    print("Captured docs/screenshots/library-dark.png")

    # Light Mode
    setup_page_state(page, 'light')
    page.evaluate("AppState.setCurrentTab('lib')")
    page.evaluate("Router.renderCurrentTab()")
    page.evaluate("""
        if (typeof LibTab !== 'undefined') {
            LibTab.state.presetsExpanded = true;
            LibTab.state.libraryExpanded = true;
            const mainContent = document.getElementById('main-content');
            LibTab.render(mainContent);
        }
    """)
    page.wait_for_timeout(1000)

    # Screen 4.2: library-light.png
    page.screenshot(path="docs/screenshots/library-light.png")
    print("Captured docs/screenshots/library-light.png")

def capture_preferences_views(page):
    print("Capturing Preferences Views...")
    # Dark Mode
    setup_page_state(page, 'dark')
    page.evaluate("AppState.setCurrentTab('prefs')")
    page.evaluate("Router.renderCurrentTab()")

    # Programmatically expand secondary panels in Preferences tab
    page.evaluate("""
        const secPrivacy = document.getElementById('section-content-privacy');
        const secData = document.getElementById('section-content-data');
        if (secPrivacy) secPrivacy.classList.remove('hidden');
        if (secData) secData.classList.remove('hidden');
    """)
    page.wait_for_timeout(1000)

    # Screen 5.1: preferences-dark.png
    page.screenshot(path="docs/screenshots/preferences-dark.png")
    print("Captured docs/screenshots/preferences-dark.png")

    # Light Mode
    setup_page_state(page, 'light')
    page.evaluate("AppState.setCurrentTab('prefs')")
    page.evaluate("Router.renderCurrentTab()")
    page.evaluate("""
        const secPrivacy = document.getElementById('section-content-privacy');
        const secData = document.getElementById('section-content-data');
        if (secPrivacy) secPrivacy.classList.remove('hidden');
        if (secData) secData.classList.remove('hidden');
    """)
    page.wait_for_timeout(1000)

    # Screen 5.2: preferences-light.png
    page.screenshot(path="docs/screenshots/preferences-light.png")
    print("Captured docs/screenshots/preferences-light.png")

def capture_collapsed_sidebar(page):
    print("Capturing Collapsed Sidebar State...")
    setup_page_state(page, 'dark')
    page.evaluate("AppState.setCurrentTab('audit')")
    page.evaluate("localStorage.setItem('sidebar-collapsed', 'true')")
    page.evaluate("Sidebar.isCollapsed = true")
    page.evaluate("Sidebar.render(document.getElementById('sidebar-container'))")
    page.evaluate("Router.renderCurrentTab()")
    page.wait_for_timeout(1000)

    # Screen 6.1: sidebar-collapsed.png
    page.screenshot(path="docs/screenshots/sidebar-collapsed.png")
    print("Captured docs/screenshots/sidebar-collapsed.png")

def capture_mobile_view(page_mobile):
    print("Capturing Mobile Responsive View...")
    # Use standard viewport and Dark Mode theme
    page_mobile.goto(APP_URL)
    page_mobile.evaluate("localStorage.setItem('mikrotik-assistant-theme', 'dark')")
    page_mobile.evaluate("document.documentElement.setAttribute('data-theme', 'dark')")
    page_mobile.evaluate("AppState.setCurrentTab('audit')")
    page_mobile.evaluate("localStorage.setItem('sidebar-collapsed', 'true')")
    page_mobile.evaluate("localStorage.setItem('right-panel-open', 'false')")
    page_mobile.evaluate("Router.renderCurrentTab()")
    page_mobile.evaluate("Sidebar.init()")
    page_mobile.wait_for_timeout(1000)

    # Screen 7.1: mobile-view.png
    page_mobile.screenshot(path="docs/screenshots/mobile-view.png")
    print("Captured docs/screenshots/mobile-view.png")

def main():
    print("Starting screenshot generation pipeline...")
    with sync_playwright() as p:
        # Launch browser headlessly
        browser = p.chromium.launch(headless=True)

        # Standard desktop context (1920x1080)
        context_desktop = browser.new_context(viewport={"width": 1920, "height": 1080})
        page_desktop = context_desktop.new_page()

        try:
            print(f"Navigating standard desktop view to: {APP_URL}")
            page_desktop.goto(APP_URL)
            page_desktop.wait_for_timeout(1000) # Wait for initial loads

            # Step 1: Capture Hero Screens (Light/Dark)
            capture_hero_views(page_desktop)

            # Step 2: Capture Active Chat Screens (Light/Dark)
            capture_active_chat_views(page_desktop)

            # Step 3: Capture Multi-Agent / Orchestrator Responses (Light/Dark)
            capture_multi_agent_views(page_desktop)

            # Step 4: Capture Configuration Builder Screens (Light/Dark)
            capture_builder_views(page_desktop)

            # Step 5: Capture Template Library Screens (Light/Dark)
            capture_library_views(page_desktop)

            # Step 6: Capture Preferences Screens (Light/Dark)
            capture_preferences_views(page_desktop)

            # Step 7: Capture Collapsed Sidebar State (Dark)
            capture_collapsed_sidebar(page_desktop)

        except Exception as e:
            print(f"Error during desktop screenshot generation: {e}", file=sys.stderr)
        finally:
            context_desktop.close()

        # Standard mobile context (375x812)
        context_mobile = browser.new_context(
            viewport={"width": 375, "height": 812},
            is_mobile=True,
            has_touch=True
        )
        page_mobile = context_mobile.new_page()

        try:
            # Step 8: Capture Mobile / Responsive View (Dark)
            capture_mobile_view(page_mobile)
        except Exception as e:
            print(f"Error during mobile screenshot generation: {e}", file=sys.stderr)
        finally:
            context_mobile.close()

        browser.close()
    print("Screenshot generation pipeline completed.")

if __name__ == "__main__":
    main()
