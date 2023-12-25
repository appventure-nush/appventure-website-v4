FROM node:16 AS builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

# replace the values in constants.ts
COPY src/constants.ts src/constants.ts
ARG STATIC_URL
ENV STATIC_URL ${STATIC_URL}
RUN apt-get update && apt-get install -y gettext-base
RUN envsubst < src/constants.ts > src/constants.ts.tmp

# copy everything in
COPY . .
RUN mv src/constants.ts.tmp src/constants.ts

RUN yarn run build

FROM busybox:musl AS deploy
EXPOSE 80

RUN adduser -D static
USER static
WORKDIR /home/static

COPY httpd.conf /data/httpd.conf
COPY --from=builder /app/dist /data/www
CMD ["busybox", "httpd", "-f", "-v", "-p", "80", "-h", "/data/www", "-c", "/data/httpd.conf"]
