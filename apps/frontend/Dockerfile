FROM node:18-slim as build

WORKDIR /app


COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npx nx build frontend --configuration=production

FROM nginx:1.27.3 as production

COPY --from=build /app/dist/apps/frontend /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
