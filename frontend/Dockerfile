# *****************************************************************************
# STAGE 1: Build the project
# *****************************************************************************
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app

RUN yarn global add turbo
COPY . .

RUN turbo prune --scope=frontend --docker

# *****************************************************************************
# STAGE 2: Install dependencies & build the project
# *****************************************************************************
# Add lockfile and package.json's of isolated subworkspace
FROM node:20-alpine AS installer

RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
RUN yarn install --network-timeout 500000

ARG VITE_PUBLIC_API_BASE_URL=""
ENV VITE_PUBLIC_API_BASE_URL=$VITE_PUBLIC_API_BASE_URL

ENV TURBO_TELEMETRY_DISABLED 1

RUN yarn turbo run build --filter=frontend

# *****************************************************************************
# STAGE 3: start it
# *****************************************************************************
FROM node:20-alpine AS runner
WORKDIR /app

EXPOSE 4173

VOLUME ["/app/node_modules", "/app/frontend/node_modules"]

CMD ["yarn", "dev", "--filter=frontend"]
