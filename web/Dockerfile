ARG REPO=reg.stw.tw
FROM ${REPO}/short-it-base
ENV NODE_ENV=production
WORKDIR /shortit
COPY . .
RUN ["pnpm", "run", "build"]

