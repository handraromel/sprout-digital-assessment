# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# Production stage
FROM node:22-alpine

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