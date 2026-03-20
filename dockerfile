# Build stage
FROM node:20.15.1-alpine3.19 as build

WORKDIR /app

# Copy only package files first (better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Type Files and build
RUN npx tsc 'src/app/GenerateTypes.ts' --outDir 'src/app' && \
    cp 'src/app/GenerateTypes.js' 'src/app/GenerateTypes.cjs' && \
    rm 'src/app/GenerateTypes.js' && \
    node 'src/app/GenerateTypes.cjs' && \
    npm run build

# Runtime stage - lightweight
FROM node:20.15.1-alpine3.19

WORKDIR /app

# Install only serve
RUN npm install -g serve

# Copy only the built application
COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
