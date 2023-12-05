FROM node:18-alpine
COPY . .
RUN npm i -g pnpm
RUN pnpm i
RUN pnpm build
EXPOSE 8080
ENTRYPOINT ["pnpm", "start"]