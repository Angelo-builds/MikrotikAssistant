import sys
import os
from playwright.sync_api import sync_playwright

def test_homepage_theme(page):
    # Navigate to the app on port 3000
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000) # Give it some time to load Monaco, Lucide etc.

    # 1. Take Dark Mode screenshot (default)
    print("Capturing Dark Mode (Default) screenshot...")
    page.screenshot(path="verification/dark_mode_default.png")

    # 2. Toggle Theme or inspect page element variables
    is_dark = page.evaluate("() => document.documentElement.classList.contains('dark')")
    print(f"Is dark mode class applied by default? {is_dark}")

    # Set theme to light manually for a moment to verify light mode class and custom CSS custom properties variables
    page.evaluate("() => AppState.setTheme('light')")
    page.wait_for_timeout(1000)
    is_light = page.evaluate("() => document.documentElement.classList.contains('light')")
    print(f"Is light mode class applied after toggle? {is_light}")

    # Capture Light Mode screenshot
    print("Capturing Light Mode screenshot...")
    page.screenshot(path="verification/light_mode_phase1.png")

    # Revert to dark mode
    page.evaluate("() => AppState.setTheme('dark')")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_homepage_theme(page)
            print("Frontend visual verification script completed successfully!")
        except Exception as e:
            print(f"Error during playwright execution: {e}")
            sys.exit(1)
        finally:
            browser.close()
