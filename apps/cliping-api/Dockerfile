FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build -w cliping-api
WORKDIR /app/apps/cliping-api
EXPOSE 8080
ENTRYPOINT ["node", "dist/main"]