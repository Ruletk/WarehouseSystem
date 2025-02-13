<<<<<<< HEAD
=======
# Stage 1: Build the React app
>>>>>>> 63818c9 (feat(frontend): Added Dockerfile for frontend deploy)
FROM node:18-slim as build

WORKDIR /app

<<<<<<< HEAD

=======
>>>>>>> 63818c9 (feat(frontend): Added Dockerfile for frontend deploy)
COPY package.json package-lock.json ./

RUN npm ci

<<<<<<< HEAD
COPY nx.json eslint.config.cjs jest.preset.js jest.config.ts tsconfig.base.json ./
COPY shared/ shared/
COPY apps/frontend/ apps/frontend/

RUN npx nx build frontend --configuration=production

FROM nginx:1.27.3 as production

COPY --from=build /app/dist/apps/frontend /usr/share/nginx/html

=======
COPY . .

RUN npx nx build frontend

# Stage 2: Serve the React app with nginx
FROM nginx:1.27.3

COPY --from=build /app/dist/apps/frontend /usr/share/nginx/html

EXPOSE 80

>>>>>>> 63818c9 (feat(frontend): Added Dockerfile for frontend deploy)
CMD ["nginx", "-g", "daemon off;"]
