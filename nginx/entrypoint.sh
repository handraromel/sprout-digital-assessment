#!/bin/sh
set -e

# Determine NGINX_ENV
NGINX_ENV=${NGINX_ENV:-local}

echo "Starting nginx with environment: ${NGINX_ENV}"

# Set default values
SERVER_NAME=${SERVER_NAME:-localhost}
UI_INTERNAL_PORT=${UI_INTERNAL_PORT:-3000}
API_INTERNAL_PORT=${API_INTERNAL_PORT:-3000}

# Set upstream hosts
if [ "$NGINX_ENV" = "production" ]; then
    UI_HOST=${UI_HOST:-ui}
    API_HOST=${API_HOST:-api}
else
    UI_HOST=${UI_HOST:-ui-dev}
    API_HOST=${API_HOST:-api-dev}
fi

export SERVER_NAME UI_INTERNAL_PORT API_INTERNAL_PORT UI_HOST API_HOST

wait_for_host() {
    local host=$1
    local max_attempts=${2:-30}
    local attempt=1
    
    echo "Waiting for $host to be resolvable..."
    while [ $attempt -le $max_attempts ]; do
        if getent hosts "$host" > /dev/null 2>&1; then
            echo "✓ $host is resolvable"
            return 0
        fi
        echo "  Attempt $attempt/$max_attempts: $host not yet resolvable, waiting..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "✗ Failed to resolve $host after $max_attempts attempts"
    return 1
}

# Select template
if [ "$NGINX_ENV" = "production" ]; then
    echo "Using production configuration for ${SERVER_NAME}"
    echo "Note: Running behind host nginx reverse proxy (host handles SSL)"
    TEMPLATE_FILE="/etc/nginx/templates/prod.conf.template"
    
    echo "Waiting for upstream services..."
    wait_for_host "$UI_HOST" 30 || { echo "ERROR: $UI_HOST service not found"; exit 1; }
    wait_for_host "$API_HOST" 30 || { echo "ERROR: $API_HOST service not found"; exit 1; }
else
    echo "Using local development configuration for ${SERVER_NAME}"
    TEMPLATE_FILE="/etc/nginx/templates/local.conf.template"
    
    echo "Waiting for upstream services..."
    wait_for_host "$UI_HOST" 30 || { echo "ERROR: $UI_HOST service not found"; exit 1; }
    wait_for_host "$API_HOST" 30 || { echo "ERROR: $API_HOST service not found"; exit 1; }
fi

# Generate NGINX configuration
echo "Generating NGINX configuration from template..."
envsubst '${SERVER_NAME} ${UI_INTERNAL_PORT} ${API_INTERNAL_PORT} ${UI_HOST} ${API_HOST}' < "$TEMPLATE_FILE" > /etc/nginx/conf.d/default.conf

echo "Starting nginx..."
exec nginx -g "daemon off;"
