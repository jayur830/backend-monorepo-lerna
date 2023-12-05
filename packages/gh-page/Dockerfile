FROM node:18-alpine AS builder
COPY . .
RUN npm i
RUN npm run build
EXPOSE 8080
ENTRYPOINT ["node", "dist/main"]