FROM node:20.19.4-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20.19.4-alpine AS runner
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY server.js ./server.js
EXPOSE 3000
CMD ["node", "server.js"]
