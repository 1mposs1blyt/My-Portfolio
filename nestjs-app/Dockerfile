# 1. Builder
FROM dockerhub.timeweb.cloud/library/node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .
RUN npx prisma generate && npm run build

# 2. Runner
FROM dockerhub.timeweb.cloud/library/node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY prisma ./prisma
COPY prisma7.config.ts ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts && node dist/main.js"]