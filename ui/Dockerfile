# ===========================================
# Base Stage - Common setup
# ===========================================
FROM node:22-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# ===========================================
# Development Stage
# ===========================================
FROM base AS development

# Install ALL dependencies (including devDependencies)
RUN npm ci

# Copy config files needed for Vite
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY eslint.config.js ./
COPY index.html ./

# Note: Source code will be mounted as volume for hot-reload
EXPOSE 5173

# Use Vite dev server with host flag for Docker networking
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ===========================================
# Builder Stage - For production build
# ===========================================
FROM base AS builder

RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

# ===========================================
# Production Stage
# ===========================================
FROM node:22-alpine AS production

RUN apk add --no-cache dumb-init

WORKDIR /app

# Install serve for static file serving
RUN npm install -g serve

# Copy built files
COPY --from=builder /app/dist /app/dist

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001 && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

ENTRYPOINT ["dumb-init", "--"]

# Serve with SPA fallback
CMD ["serve", "-s", "dist", "-l", "3000"]