FROM node:26-slim AS build

RUN npm install -g bun

WORKDIR /app

# Install the whole workspace from the root lockfile. Copying every workspace
# manifest first keeps this layer cacheable.
COPY package.json bun.lock bunfig.toml ./
COPY apps/portfolio/package.json apps/portfolio/package.json
COPY apps/blog/package.json apps/blog/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build:portfolio

FROM node:26-slim

WORKDIR /app

# The portfolio is built with Nitro's node-server preset by default.
COPY --from=build /app/apps/portfolio/.output ./.output
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
# Keep the workspace symlink target available in case something resolves it.
COPY --from=build /app/packages/ui ./packages/ui

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# TanStack Start / Nitro prod server output
CMD ["node", ".output/server/index.mjs"]
