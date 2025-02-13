# Stage 1: Build the React app
FROM node:18-slim as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .


RUN npx nx build frontend --configuration=production

# Stage 2: Serve the React app with nginx
FROM nginx:1.27.3

COPY --from=build /app/dist/apps/frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
