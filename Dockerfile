FROM node:18-alpine

WORKDIR /app

# Install dependencies required for Prisma and other native modules
RUN apk add --no-cache libc6-compat python3 make g++ openssl

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy all files
COPY . .

# Generate Prisma client
RUN mkdir -p prisma && npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application (run migrations first)
CMD npx prisma db push && npm start
