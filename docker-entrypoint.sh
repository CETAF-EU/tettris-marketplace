#!/bin/sh
set -eu

# Runtime configuration must come from container environment variables
# (e.g. docker compose env_file).
required_vars="VITE_API_URL VITE_HANDLE_URL VITE_DEV"
for required_var in $required_vars; do
  eval "required_value=\${$required_var:-}"
  if [ -z "$required_value" ]; then
    echo "ERROR: Missing required environment variable: $required_var" >&2
    exit 1
  fi
done

escape_sed() {
  printf '%s' "$1" | sed -e 's/[\\/&|]/\\\\&/g'
}

replace_placeholder() {
  var_name="$1"
  eval "value=\${$var_name:-}"

  placeholder="__${var_name}__"
  escaped_value="$(escape_sed "$value")"

  find /app/build -type f \( -name '*.js' -o -name '*.html' -o -name '*.css' \) \
    -exec sed -i "s|${placeholder}|${escaped_value}|g" {} +
}

for var in \
  VITE_API_URL \
  VITE_HANDLE_URL \
  VITE_DEV \
  VITE_MARKETPLACE_API_TOKEN \
  VITE_FRIENDLY_CAPTCHA_SITEKEY \
  VITE_ORCID_CLIENT_ID \
  VITE_ORCID_REDIRECT_URI; do
  replace_placeholder "$var"
done

if grep -R --include='*.js' --include='*.html' --include='*.css' -q '__VITE_' /app/build; then
  echo "ERROR: Unresolved VITE placeholders found in built assets." >&2
  exit 1
fi

echo "Using VITE_API_URL=${VITE_API_URL}"

exec serve -s build -l 3000
