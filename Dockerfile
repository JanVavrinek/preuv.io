# Build stage
FROM node:23-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY src/assets/solid-icons.tar.gz ./src/assets/solid-icons.tar.gz

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm typecheck

RUN pnpm build

# Production stage
FROM node:23-alpine

WORKDIR /app

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
