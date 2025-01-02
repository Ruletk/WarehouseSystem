FROM node:18-slim as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx nx build auth --configuration=production


FROM node:18-slim as production

WORKDIR /app

COPY --from=build /app/dist/apps/auth ./dist

COPY --from=build /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]

STOPSIGNAL SIGTERM
