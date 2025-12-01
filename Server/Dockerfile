# Multi-stage build for optimal size and speed
# Use Node 20 Alpine with security patches
# Stage 1: Dependencies (cached layer)
FROM node:20-alpine AS deps
WORKDIR /app

# Install security updates
RUN apk upgrade --no-cache

COPY package*.json ./
# Use npm ci for faster, deterministic installs
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 2: Development (if needed)
FROM node:20-alpine AS development
RUN apk upgrade --no-cache
WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
EXPOSE 5000 9229
CMD ["npm", "run", "dev"]

# Stage 3: Production (final, smallest image)
FROM node:20-alpine AS production

# Install security updates and curl for health checks
RUN apk upgrade --no-cache && \
    apk add --no-cache curl
WORKDIR /app

# Copy only production dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["node", "src/server.js"]
