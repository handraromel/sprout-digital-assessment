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

# Function to wait for a host to be resolvable
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

# Select and process the appropriate template
if [ "$NGINX_ENV" = "production" ]; then
    echo "Using production configuration for ${SERVER_NAME}"
    TEMPLATE_FILE="/etc/nginx/templates/prod.conf.template"
    
    # Wait for upstream services in production
    echo "Waiting for upstream services..."
    wait_for_host "ui-prod" 30 || { echo "ERROR: ui-prod service not found"; exit 1; }
    wait_for_host "api-prod" 30 || { echo "ERROR: api-prod service not found"; exit 1; }
    
    # Verify SSL certificates exist
    if [ ! -f "/etc/letsencrypt/live/${SERVER_NAME}/fullchain.pem" ]; then
        echo "Warning: SSL certificate not found at /etc/letsencrypt/live/${SERVER_NAME}/fullchain.pem"
        echo "Falling back to local (HTTP-only) configuration"
        TEMPLATE_FILE="/etc/nginx/templates/local.conf.template"
    fi
else
    echo "Using local development configuration for ${SERVER_NAME}"
    TEMPLATE_FILE="/etc/nginx/templates/local.conf.template"
    
    # Wait for upstream services in development
    echo "Waiting for upstream services..."
    wait_for_host "ui-dev" 30 || { echo "ERROR: ui-dev service not found"; exit 1; }
    wait_for_host "api-dev" 30 || { echo "ERROR: api-dev service not found"; exit 1; }
fi

# Process template with envsubst and output to conf.d
envsubst '${SERVER_NAME} ${UI_INTERNAL_PORT} ${API_INTERNAL_PORT}' < "$TEMPLATE_FILE" > /etc/nginx/conf.d/default.conf

echo "Configuration generated:"
cat /etc/nginx/conf.d/default.conf

# Test nginx configuration
nginx -t

echo "Starting nginx..."
exec nginx -g 'daemon off;'
