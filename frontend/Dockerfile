FROM node:20-slim

WORKDIR /app

# Apply OS security updates to address known vulnerabilities
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get upgrade -y --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package manifests first for caching
COPY package.json pnpm-lock.yaml* ./

# Install deps
RUN pnpm install --frozen-lockfile --prod=false

# Copy source
COPY . .

ENV PORT=5173
ENV HOST=0.0.0.0

EXPOSE 5173

# Default to running the vite dev server for convenience in development.
# Use shell form so $PORT and $HOST are expanded at container run time (set via docker-compose env)
CMD pnpm dev -- --host $HOST --port $PORT
