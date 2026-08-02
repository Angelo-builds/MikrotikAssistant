import sys
import os
from playwright.sync_api import sync_playwright

def verify_redesign(page):
    print("Navigating to application homepage...")
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000) # wait for Monaco and Lucide to fully load

    # 1. Take a screenshot of the compact, modern Audit Tab (Homepage)
    print("Capturing Audit Tab (Homepage)...")
    page.screenshot(path="verification/audit_tab_compact.png")

    # 2. Let's switch to the Build tab (Configuration Builder)
    print("Switching to Build Tab...")
    page.click("button[data-tab='build']")
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/build_tab_compact.png")

    # 3. Let's switch to the Library tab (Template Library)
    print("Switching to Library Tab...")
    page.click("button[data-tab='lib']")
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/library_tab_compact.png")

    # 4. Let's switch to the Preferences tab
    print("Switching to Preferences Tab...")
    page.click("button[data-tab='prefs']")
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/preferences_compact.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Set a standard desktop viewport
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        try:
            verify_redesign(page)
            print("Visual redesign screenshots captured successfully!")
        except Exception as e:
            print(f"Error during redesign verification: {e}")
            sys.exit(1)
        finally:
            browser.close()
