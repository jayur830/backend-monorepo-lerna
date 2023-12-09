FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build -w gh-page
WORKDIR /app/apps/gh-page
EXPOSE 8080
ENTRYPOINT ["node", "dist/main"]