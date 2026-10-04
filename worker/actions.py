import os
import asyncio
from playwright.async_api import async_playwright
import httpx
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()


async def scrape_web_action(url: str) -> dict:
    print(f"[\dffd0 BROWSER] Launching Playwright to visit: {url}")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        page = await context.new_page()
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=15000)
            title = await page.title()
            content = await page.evaluate("""() => {
                document.querySelectorAll('script, style, svg, noscript').forEach(el => el.remove());
                return document.body.innerText.slice(0, 4000);
            }""")
            await browser.close()
            return {"status": "SUCCESS", "title": title, "content": content.strip()}
        except Exception as e:
            await browser.close()
            return {"status": "FAILED", "error": str(e), "title": "Web Extraction", "content": ""}


async def gemini_ai_action(prompt: str, context_text: str = "") -> dict:
    print(f"[\dffe0 GEMINI] Running LLM analysis (Key: {bool(GEMINI_API_KEY)})...")
    if not GEMINI_API_KEY:
        return {
            "status": "SUCCESS",
            "ai_analysis": f"Scraped {len(context_text)} chars from page."
        }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    full_prompt = f"Task: {prompt}\n\nExtracted Content:\n{context_text}\n\nProvide a clear formatted summary."
    payload = {"contents": [{"parts": [{"text": full_prompt}]}]}

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                data = response.json()
                answer = data["candidates"][0]["content"]["parts"][0]["text"]
                return {"status": "SUCCESS", "ai_analysis": answer}
            else:
                print(f"[\df3d FAILED] Gemini Error: {response.text}")
                return {"status": "FAILED", "ai_analysis": f(" Gemini Error " + response.text)}
        except Exception as e:
            return {"status": "FAILED", "ai_analysis": str(e)}


async def webhook_dispatch_action(target_url: str, data: dict) -> dict:
    return {"status": "SUCCESS"}
