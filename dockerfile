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

# Accept build arguments for environment variables
ARG VITE_HANDLE_URL
ARG VITE_FRIENDLY_CAPTCHA_SITEKEY
ARG VITE_CORDRA_PASSWORD
ARG VITE_EMAILJS_ID
ARG VITE_EMAILJS_TEMPLATE_ID
ARG VITE_EMAILJS_USER_ID
ARG VITE_ORCID_CLIENT_ID
ARG VITE_ORCID_CLIENT_SECRET
ARG VITE_ORCID_REDIRECT_URI
ARG VITE_IMAGE_API
ARG VITE_DEV

# Create .env file using build arguments
RUN echo "VITE_HANDLE_URL=$VITE_HANDLE_URL" >> .env
RUN echo "VITE_FRIENDLY_CAPTCHA_SITEKEY=$VITE_FRIENDLY_CAPTCHA_SITEKEY" >> .env
RUN echo "VITE_CORDRA_PASSWORD=$VITE_CORDRA_PASSWORD" >> .env
RUN echo "VITE_EMAILJS_ID=$VITE_EMAILJS_ID" >> .env
RUN echo "VITE_EMAILJS_TEMPLATE_ID=$VITE_EMAILJS_TEMPLATE_ID" >> .env
RUN echo "VITE_EMAILJS_USER_ID=$VITE_EMAILJS_USER_ID" >> .env
RUN echo "VITE_ORCID_CLIENT_ID=$VITE_ORCID_CLIENT_ID" >> .env
RUN echo "VITE_ORCID_CLIENT_SECRET=$VITE_ORCID_CLIENT_SECRET" >> .env
RUN echo "VITE_ORCID_REDIRECT_URI=$VITE_ORCID_REDIRECT_URI" >> .env
RUN echo "VITE_IMAGE_API=$VITE_IMAGE_API" >> .env
RUN echo "VITE_PROXY=false" >> .env
RUN echo "VITE_DEV=$VITE_DEV" >> .env

# Setting app to production build
RUN npm run build

# Setting up NGINX
FROM nginx:stable-alpine

COPY --from=build /marketplace/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

# Start application
CMD ["nginx", "-g", "daemon off;"]
