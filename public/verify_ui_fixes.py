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

        # Initially, sidebar should not be collapsed
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

        # Toggle back to expanded so we can see the history panel
        toggle_sidebar_btn.click()
        page.wait_for_timeout(300)

        # --- TEST 2: Left Sidebar History Collapsible State ---
        history_panel = page.locator("#history-panel")
        toggle_history_btn = page.locator("#btn-toggle-history")

        # Initially, history panel should not be collapsed (default first load)
        expect(history_panel).not_to_have_class(re.compile(r"collapsed"))
        print("History panel initially expanded successfully!")

        # Click to collapse history
        toggle_history_btn.click()
        page.wait_for_timeout(200)
        expect(history_panel).to_have_class(re.compile(r"collapsed"))
        print("After click, history panel collapsed successfully!")

        # Check localStorage has saved 'history-panel-collapsed' as true
        history_panel_storage_val = page.evaluate("localStorage.getItem('history-panel-collapsed')")
        print("localStorage 'history-panel-collapsed' value:", history_panel_storage_val)
        assert history_panel_storage_val == "true"

        # --- TEST 3: New Session Replacement ---
        btn_new_session = page.locator("#btn-new-session")
        btn_new_session.click()
        page.wait_for_timeout(200)

        # PromptModal should have been rendered on page
        prompt_modal = page.locator("text=Start New Session")
        expect(prompt_modal).to_be_visible()
        print("New Session replacement prompt modal is verified visible!")

        # Click Cancel to dismiss the prompt modal
        btn_cancel = page.locator("button:has-text('Cancel')")
        btn_cancel.click()
        page.wait_for_timeout(200)
        expect(prompt_modal).not_to_be_visible()
        print("Modal cancelled and dismissed successfully!")

        # Save a screenshot of current state
        page.screenshot(path="/home/jules/verification/ui_fixes_screenshot.png")
        print("Screenshot saved to /home/jules/verification/ui_fixes_screenshot.png")

        browser.close()
        print("Frontend verification of UI fixes passed completely!")

if __name__ == "__main__":
    test_ui_fixes()
