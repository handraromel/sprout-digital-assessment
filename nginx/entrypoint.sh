#!/bin/sh
set -e

# Determine which config template to use based on NGINX_ENV
NGINX_ENV=${NGINX_ENV:-local}

echo "Starting nginx with environment: ${NGINX_ENV}"

# Set default values for environment variables
SERVER_NAME=${SERVER_NAME:-localhost}
UI_INTERNAL_PORT=${UI_INTERNAL_PORT:-3000}
API_INTERNAL_PORT=${API_INTERNAL_PORT:-3000}

export SERVER_NAME UI_INTERNAL_PORT API_INTERNAL_PORT

# Select and process the appropriate template
if [ "$NGINX_ENV" = "production" ]; then
    echo "Using production configuration for ${SERVER_NAME}"
    TEMPLATE_FILE="/etc/nginx/templates/prod.conf.template"
    
    # Verify SSL certificates exist
    if [ ! -f "/etc/letsencrypt/live/${SERVER_NAME}/fullchain.pem" ]; then
        echo "Warning: SSL certificate not found at /etc/letsencrypt/live/${SERVER_NAME}/fullchain.pem"
        echo "Falling back to local (HTTP-only) configuration"
        TEMPLATE_FILE="/etc/nginx/templates/local.conf.template"
    fi
else
    echo "Using local development configuration for ${SERVER_NAME}"
    TEMPLATE_FILE="/etc/nginx/templates/local.conf.template"
fi

# Process template with envsubst and output to conf.d
envsubst '${SERVER_NAME} ${UI_INTERNAL_PORT} ${API_INTERNAL_PORT}' < "$TEMPLATE_FILE" > /etc/nginx/conf.d/default.conf

echo "Configuration generated:"
cat /etc/nginx/conf.d/default.conf

# Test nginx configuration
nginx -t

echo "Starting nginx..."
exec nginx -g 'daemon off;'
