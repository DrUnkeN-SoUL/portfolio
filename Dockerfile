FROM node:26-slim AS build

RUN npm install -g bun

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM node:26-slim

WORKDIR /app

COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# TanStack Start / Nitro prod server output
CMD ["node", ".output/server/index.mjs"]
