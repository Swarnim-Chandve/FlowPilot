import os
import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from playwright.async_api import async_playwright
import httpx
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()


async def scrape_web_action(url: str) -> dict:
    print(f"[BROWSER] Launching Playwright to visit: {url}")
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
    print(f"[GEMINI] Running LLM analysis (Key: {bool(GEMINI_API_KEY)})...")
    if not GEMINI_API_KEY:
        return {
            "status": "SUCCESS",
            "ai_analysis": f"Scraped {len(context_text)} chars from page. (Configure GEMINI_API_KEY for synthesis)"
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
                print(f"[FAILED] Gemini Error: {response.text}")
                # Fallback to gemini-1.5-flash
                fb_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
                fb_res = await client.post(fb_url, json=payload)
                if fb_res.status_code == 200:
                    fb_data = fb_res.json()
                    fb_answer = fb_data["candidates"][0]["content"]["parts"][0]["text"]
                    return {"status": "SUCCESS", "ai_analysis": fb_answer}
                return {"status": "FAILED", "ai_analysis": f"Gemini Error: {response.text}"}
        except Exception as e:
            return {"status": "FAILED", "ai_analysis": str(e)}


async def send_email_action(recipient: str, subject: str, content: str) -> dict:
    smtp_email = os.getenv("SMTP_EMAIL", "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "").strip()
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com").strip()
    smtp_port = int(os.getenv("SMTP_PORT", "587"))

    if not recipient:
        recipient = "recoverybro23@gmail.com"
    if not subject:
        subject = "[FlowPilot AI Alert] Autonomous Execution Report"

    print(f"\n[EMAIL DISPATCH] Preparing email to: {recipient}")
    print(f"[EMAIL DISPATCH] Subject: {subject}")

    if smtp_email and smtp_password:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = smtp_email
            msg["To"] = recipient

            html_body = f"""
            <html>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: #0f172a; color: #ffffff; padding: 16px 24px; border-radius: 12px 12px 0 0;">
                        <h2 style="margin: 0; font-size: 18px;">⚡ FlowPilot AI Autonomous Digest</h2>
                    </div>
                    <div style="border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 12px 12px; background: #ffffff;">
                        <h3 style="margin-top: 0; color: #0f172a;">AI Synthesis Summary</h3>
                        <div style="background: #f8fafc; border-left: 4px solid #f97316; padding: 16px; border-radius: 4px; font-size: 14px; white-space: pre-wrap;">
{content}
                        </div>
                        <p style="font-size: 12px; color: #64748b; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                            Dispatched by FlowPilot Distributed Execution Engine | Sub-15ms Ingress
                        </p>
                    </div>
                </body>
            </html>
            """
            msg.attach(MIMEText(html_body, "html"))

            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                server.starttls()
                server.login(smtp_email, smtp_password)
                server.sendmail(smtp_email, [recipient], msg.as_string())

            print(f"[EMAIL SUCCESS] Delivered to inbox: {recipient}!\n")
            return {"status": "DELIVERED", "recipient": recipient, "provider": "SMTP (Live Delivery)"}
        except Exception as err:
            print(f"[EMAIL ERROR] Failed SMTP transmission: {err}")
            return {"status": "FAILED", "error": str(err), "recipient": recipient}
    else:
        print(f"[EMAIL NOTICE] SMTP credentials not set in .env. Formatted email ready for {recipient}.")
        return {
            "status": "SIMULATED",
            "recipient": recipient,
            "message": f"Formatted digest prepared for {recipient}. Add SMTP_EMAIL and SMTP_PASSWORD to .env for live Gmail delivery."
        }


async def send_slack_action(webhook_url: str, message: str) -> dict:
    if not webhook_url or "XXXX" in webhook_url:
        print(f"[SLACK NOTICE] Mock Slack webhook triggered.")
        return {"status": "SIMULATED", "message": "Slack alert formatted and ready."}
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            res = await client.post(webhook_url, json={"text": f"⚡ *FlowPilot AI Alert*:\n{message}"})
            return {"status": "DELIVERED" if res.status_code == 200 else "FAILED"}
        except Exception as e:
            return {"status": "FAILED", "error": str(e)}


async def webhook_dispatch_action(target_url: str, data: dict) -> dict:
    if not target_url or "yourdomain.com" in target_url:
        return {"status": "SIMULATED"}
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            res = await client.post(target_url, json=data)
            return {"status": "DELIVERED" if res.status_code < 400 else "FAILED"}
        except Exception as e:
            return {"status": "FAILED", "error": str(e)}
