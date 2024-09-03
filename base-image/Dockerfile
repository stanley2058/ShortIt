ARG REPO=reg.stw.tw
FROM ${REPO}/short-it-base
RUN ["npm", "i", "-g", "pnpm"]
WORKDIR /shortit
COPY . .
RUN ["pnpm", "i"]
