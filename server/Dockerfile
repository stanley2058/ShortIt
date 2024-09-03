ARG REPO=reg.stw.tw
FROM ${REPO}/short-it-web AS web
FROM ${REPO}/short-it-base AS build
COPY . .
RUN ["pnpm", "i"]
RUN ["pnpm", "run", "db:generate"]
RUN ["pnpm", "run", "test"]
RUN ["pnpm", "run", "build"]

FROM node:lts-alpine
ENV NODE_ENV=production
RUN ["npm", "i", "-g", "pnpm"]
WORKDIR /shortit
COPY prisma .
COPY package.json pnpm-lock.yaml ./
RUN ["pnpm", "i"]
RUN ["pnpm", "run", "db:generate"]
COPY --from=build /shortit/dist .
COPY --from=web /shortit/dist dist
CMD ["node", "index.js"]
