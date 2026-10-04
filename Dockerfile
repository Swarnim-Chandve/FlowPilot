# Official Microsoft Playwright image - preconfigured with all Chromium dependencies
FROM mcr.microsoft.com/playwright/python:v1.49.0-noble

WORKDIR /app

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Chromium browser binary for Playwright
RUN playwright install chromium

# Copy application source code
COPY . .

# Default command (overridden by docker-compose)
CMD ["python", "-m", "worker.worker"]
