FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install -g ts-node typescript

RUN npm install --frozen-lockfile

RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 5001

CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && node dist/src/main"]

