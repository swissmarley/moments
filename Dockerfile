FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat

# Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --omit=dev

# Full deps for building
FROM base AS full-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy all dependencies
COPY --from=full-deps /app/node_modules ./node_modules
COPY . .

# Set environment for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=true
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=3072

# Generate Prisma client BEFORE build
COPY prisma ./prisma
RUN npx prisma generate

# Build application
RUN npm run build

# Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create app user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public 2>/dev/null || true

# Copy Prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy runtime dependencies only
COPY --from=deps /app/node_modules ./node_modules

# Create uploads directory
RUN mkdir -p uploads && chown -R nextjs:nodejs uploads

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
