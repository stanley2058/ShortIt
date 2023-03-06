ARG REPO=reg.stw.tw
FROM ${REPO}/short-it-web as web
FROM ${REPO}/short-it-base as build
COPY . .
RUN ["npm", "i"]
RUN ["npm", "run", "db:generate"]
RUN ["npm", "run", "test"]
RUN ["npm", "run", "build"]

FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /shortit
COPY prisma .
COPY package.json package-lock.json ./
RUN ["npm", "i"]
RUN ["npm", "run", "db:generate"]
COPY --from=build /shortit/dist .
COPY --from=web /shortit/dist dist
CMD ["node", "index.js"]
