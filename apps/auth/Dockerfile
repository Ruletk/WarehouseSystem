FROM node:18-slim as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY nx.json eslint.config.cjs jest.preset.js jest.config.ts tsconfig.base.json ./
COPY shared/ shared/
COPY apps/auth/ apps/auth/

RUN npx nx reset && \
    npx nx build auth --configuration=production


FROM node:18-slim as production

WORKDIR /app

COPY --from=build /app/dist/apps/auth ./dist

COPY --from=build /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]

STOPSIGNAL SIGTERM
