FROM oven/bun:1.1-alpine

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install

COPY . .

EXPOSE 5173

# Run Vite dev server bound to 0.0.0.0 so host machine can access it
CMD ["bun", "dev", "--host", "0.0.0.0"]
