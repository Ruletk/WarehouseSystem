FROM node:18-slim as build

WORKDIR /app


COPY package.json package-lock.json ./

RUN npm ci

COPY nx.json eslint.config.cjs jest.preset.js jest.config.ts tsconfig.base.json ./
COPY shared/ shared/
COPY apps/frontend/ apps/frontend/

RUN npx nx build frontend --configuration=production

FROM nginx:1.27.3 as production

COPY --from=build /app/dist/apps/frontend /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
