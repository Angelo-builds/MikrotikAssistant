import os
from playwright.sync_api import sync_playwright, expect

def test_audit_tab():
    # Ensure verification folder exists
    os.makedirs("/home/jules/verification", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Configure a standard laptop viewport size
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        # 1. Navigate to the local app
        print("Navigating to http://localhost:3000...")
        page.goto("http://localhost:3000")

        # Wait for some elements to load
        page.wait_for_selector("#panel-welcome")

        # Take a screenshot of the Welcome state
        print("Capturing Welcome screen...")
        page.screenshot(path="/home/jules/verification/welcome_screen.png")

        # Verify welcome panel is present
        welcome_panel = page.locator("#panel-welcome")
        expect(welcome_panel).to_be_visible()
        print("Welcome panel visible!")

        # 2. Click the "🛡️ Audit Firewall Security" scenario card
        print("Clicking Scenario Firewall card...")
        page.locator("#btn-scenario-firewall").click()

        # Wait a bit for the text-area to fill and drawer to open
        page.wait_for_timeout(1000)

        # Capture another screenshot with the scenario pre-filled and attachment drawer visible
        print("Capturing Scenario pre-filled screen...")
        page.screenshot(path="/home/jules/verification/scenario_pre_filled.png")

        # 3. Clean up
        browser.close()
        print("Frontend verification complete!")

if __name__ == "__main__":
    test_audit_tab()
