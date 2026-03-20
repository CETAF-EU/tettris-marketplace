# Pull official node image as base
FROM node:20.15.1-alpine3.19 as build

# Set working directory
WORKDIR /marketplace

# Install dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install npm@10.8.2

# Copy application
COPY . ./

# Generate Type Files
RUN npm install typescript -g

RUN tsc 'src/app/GenerateTypes.ts' --outDir 'src/app'
RUN cp 'src/app/GenerateTypes.js' 'src/app/GenerateTypes.cjs'
RUN rm 'src/app/GenerateTypes.js'
RUN node 'src/app/GenerateTypes.cjs'

# Setting app to production build
RUN npm run build

# Install serve to run the app
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start application
CMD ["serve", "-s", "build", "-l", "3000"]
