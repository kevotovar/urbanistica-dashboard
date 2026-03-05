FROM node:22-alpine

WORKDIR /app

# Enable corepack and pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files first
COPY package.json pnpm-lock.yaml ./

# Install packages
RUN pnpm install

# Copy application files
COPY . .

# Expose the default Vite port
EXPOSE 3000

# Run Vite bound to 0.0.0.0 for Docker networking and external access
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]
