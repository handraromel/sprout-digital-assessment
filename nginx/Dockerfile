FROM nginx:1.25-alpine

# Install envsubst (part of gettext)
RUN apk add --no-cache gettext

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create templates directory and copy templates
RUN mkdir -p /etc/nginx/templates
COPY local.conf.template /etc/nginx/templates/
COPY prod.conf.template /etc/nginx/templates/

# Copy and set permissions for entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose ports
EXPOSE 80 443

# Health check (use 127.0.0.1 instead of localhost to avoid IPv6 issues)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/health || exit 1

ENTRYPOINT ["/entrypoint.sh"]
