FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build -w @toy/decorator -w @toy/guard -w @toy/firebase
RUN npm run build -w auth-api
WORKDIR /app/apps/auth-api
EXPOSE 8080
ENTRYPOINT ["node", "dist/main"]