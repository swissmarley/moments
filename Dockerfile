FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++

# Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --omit=dev

# Full dependencies for building
FROM base AS full-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Builder stage
FROM base AS builder
WORKDIR /app

COPY --from=full-deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=true
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=3072

# Generate Prisma client FIRST
RUN mkdir -p prisma && npx prisma generate 2>&1 || true

# Build with verbose output
RUN npm run build 2>&1

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public 2>/dev/null || true

COPY --from=builder /app/prisma ./prisma 2>/dev/null || true
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma 2>/dev/null || true
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma 2>/dev/null || true

COPY --from=deps /app/node_modules ./node_modules

RUN mkdir -p uploads && chown -R nextjs:nodejs uploads

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
