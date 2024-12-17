# *****************************************************************************
# STAGE 1: Build the project
# *****************************************************************************
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN yarn global add turbo
COPY . .

RUN turbo prune --scope=backend --docker

# *****************************************************************************
# STAGE 2: Install dependencies & build the project
# *****************************************************************************
FROM node:20-alpine AS installer

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY .gitignore .gitignore
RUN yarn install --network-timeout 500000

ARG DB_TYPE=""
ENV DB_TYPE=$DB_TYPE

ARG DB_HOST=""
ENV DB_HOST=$DB_HOST

ARG DB_PORT=""
ENV DB_PORT=$DB_PORT

ARG DB_USERNAME=""
ENV DB_USER=$DB_USERNAME

ARG DB_PASSWORD=""
ENV DB_PASSWORD=$DB_PASSWORD

ARG DB_NAME=""
ENV DB_NAME=$DB_NAME

ARG PORT=""
ENV PORT=$PORT

ARG SECRET_KEY=""
ENV SECRET_KEY=$SECRET_KEY

ARG EXPIRE_TIME=""
ENV EXPIRE_TIME=$EXPIRE_TIME

ENV TURBO_TELEMETRY_DISABLED 1

# *****************************************************************************
# STAGE 3: start it
# *****************************************************************************
FROM node:20-alpine AS runner
WORKDIR /app

EXPOSE 8000

VOLUME ["/app/node_modules", "/app/backend/node_modules"]

CMD ["yarn", "dev", "--filter=backend"]
