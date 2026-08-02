import os
import re
from playwright.sync_api import sync_playwright, expect

def test_ui_fixes():
    os.makedirs("/home/jules/verification", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        print("Navigating to http://localhost:3000...")
        page.goto("http://localhost:3000")

        # Wait for app loaded
        page.wait_for_selector("#panel-welcome")

        # --- TEST 1: Sidebar Collapsible state ---
        sidebar = page.locator("#sidebar")
        toggle_sidebar_btn = page.locator("#sidebar-toggle")

        # Initially, sidebar should not be collapsed (width 200px)
        expect(sidebar).not_to_have_class(re.compile(r"sidebar-collapsed"))
        print("Initial sidebar class matches: expanded")

        # Click to collapse
        toggle_sidebar_btn.click()
        page.wait_for_timeout(300) # wait for animation
        expect(sidebar).to_have_class(re.compile(r"sidebar-collapsed"))
        print("After click, sidebar class matches: collapsed")

        # Check localStorage has saved 'sidebar-collapsed' as true
        collapsed_storage_val = page.evaluate("localStorage.getItem('sidebar-collapsed')")
        print("localStorage 'sidebar-collapsed' value:", collapsed_storage_val)
        assert collapsed_storage_val == "true"

        # --- TEST 2: Right Panel Session History Closed by Default ---
        right_panel = page.locator("#sidebar-control-center")
        toggle_right_btn = page.locator("#right-panel-toggle")

        # Initially, right panel should be closed (width 0, class overflow-hidden etc)
        expect(right_panel).not_to_have_class(re.compile(r"opacity-100"))
        print("Initial right panel closed successfully!")

        # Click to open right panel
        toggle_right_btn.click()
        page.wait_for_timeout(300) # wait for animation
        expect(right_panel).to_have_class(re.compile(r"opacity-100"))
        print("After click, right panel opened successfully!")

        # Check localStorage has saved 'right-panel-open' as true
        panel_storage_val = page.evaluate("localStorage.getItem('right-panel-open')")
        print("localStorage 'right-panel-open' value:", panel_storage_val)
        assert panel_storage_val == "true"

        # Click to collapse sidebar and take a screenshot of current state
        # (sidebar collapsed, right panel open)
        page.screenshot(path="/home/jules/verification/ui_fixes_screenshot.png")
        print("Screenshot saved to /home/jules/verification/ui_fixes_screenshot.png")

        browser.close()
        print("Frontend verification of UI fixes passed completely!")

if __name__ == "__main__":
    test_ui_fixes()
