FROM node:18-alpine
COPY . .
RUN npm i
RUN npm run build -w gh-page
EXPOSE 8080
ENTRYPOINT ["node", "apps/gh-page/dist/main"]