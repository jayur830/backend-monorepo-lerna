FROM node:18-alpine
COPY . .
RUN npm i
RUN npm run build -w cliping-api
EXPOSE 8080
ENTRYPOINT ["node", "apps/cliping-api/dist/main"]