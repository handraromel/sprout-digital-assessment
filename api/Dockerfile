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

# Install build dependencies for native modules (needed for some npm packages)
RUN apk add --no-cache python3 make g++

# Install ALL dependencies (including devDependencies)
RUN npm ci

# Copy prisma schema for client generation
COPY prisma ./prisma
COPY prisma.config.ts ./

# Copy tsconfig for TypeScript compilation (needed for prisma client compilation)
COPY tsconfig.json ./

# Generate Prisma Client and compile TypeScript to JavaScript
# Node.js 22 has issues with ESM detection in .ts files, so we pre-compile to CommonJS
RUN npx prisma generate && \
    cd ./generated/prisma && \
    npx tsc --target ES2020 --module commonjs --declaration --skipLibCheck --esModuleInterop ./*.ts ./internal/*.ts ./models/*.ts && \
    cd ../.. && \
    echo '{"type":"commonjs"}' > ./generated/prisma/package.json

# Note: Source code will be mounted as volume for hot-reload
EXPOSE 3000

# Use ts-node-dev for hot-reload
# --poll flag ensures file changes are detected in Docker volumes (especially on Windows)
CMD ["npx", "ts-node-dev", "--require", "tsconfig-paths/register", "--respawn", "--transpile-only", "--poll", "src/index.ts"]

# ===========================================
# Builder Stage - For production build
# ===========================================
FROM base AS builder

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client and mark generated folder as CommonJS
RUN npx prisma generate && \
    echo '{"type":"commonjs"}' > ./generated/prisma/package.json

# Build TypeScript with path alias resolution
RUN npm run build

# Verify build output exists
RUN ls -la /app/dist/src && test -f /app/dist/src/index.js && echo "✅ Build successful"

# ===========================================
# Production Stage
# ===========================================
FROM node:22-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built artifacts from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/generated ./generated
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/prisma.config.ts ./prisma.config.ts

# Switch to non-root user
USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/src/index.js"]