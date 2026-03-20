# Build stage
FROM node:20.15.1-alpine3.19 AS build

WORKDIR /app

# Copy only package files first (better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build with placeholder values that are replaced at container startup.
# Generate Type Files and build
RUN npx tsc 'src/app/GenerateTypes.ts' --outDir 'src/app' && \
    cp 'src/app/GenerateTypes.js' 'src/app/GenerateTypes.cjs' && \
    rm 'src/app/GenerateTypes.js' && \
    node 'src/app/GenerateTypes.cjs' && \
    VITE_API_URL=__VITE_API_URL__ \
    VITE_HANDLE_URL=__VITE_HANDLE_URL__ \
    VITE_DEV=__VITE_DEV__ \
    VITE_MARKETPLACE_API_TOKEN=__VITE_MARKETPLACE_API_TOKEN__ \
    VITE_FRIENDLY_CAPTCHA_SITEKEY=__VITE_FRIENDLY_CAPTCHA_SITEKEY__ \
    VITE_ORCID_CLIENT_ID=__VITE_ORCID_CLIENT_ID__ \
    VITE_ORCID_REDIRECT_URI=__VITE_ORCID_REDIRECT_URI__ \
    npm run build

# Runtime stage - lightweight
FROM node:20.15.1-alpine3.19

WORKDIR /app

# Install only serve
RUN npm install -g serve

# Copy only the built application
COPY --from=build /app/build ./build
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
