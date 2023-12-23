FROM node:16 AS builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile
COPY . .

# replace the values in constants.ts
ARG STATIC_URL
ENV STATIC_URL ${STATIC_URL}
RUN apt-get update && apt-get install -y gettext-base
RUN envsubst < src/constants.ts > src/constants.ts.tmp
RUN mv src/constants.ts.tmp src/constants.ts

# remove the readme in the static folder
RUN rm static/README.md

RUN yarn run gridsome build

FROM nginx:alpine-slim AS deploy
EXPOSE 80
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /data/www
