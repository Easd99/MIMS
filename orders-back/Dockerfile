FROM node:20 AS builder

WORKDIR /app


COPY package*.json ./
COPY prisma ./prisma

RUN npm install --frozen-lockfile

RUN npx prisma generate

COPY generated ./generated

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated

EXPOSE 5001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

