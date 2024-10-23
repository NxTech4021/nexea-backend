# FROM node:20-alpine3.17 AS development

# WORKDIR /app

# COPY package.json ./
# COPY yarn.lock ./
# COPY prisma ./prisma
# RUN yarn install

# COPY . .

# EXPOSE 3001

# CMD [ "yarn", "dev" ]

FROM node:20-alpine3.17 AS base
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./

FROM base AS development
ENV NODE_ENV=development
RUN yarn install --production=false
RUN mkdir -p /app/src/pdf
COPY . .
RUN yarn global add prisma
RUN npx prisma generate
EXPOSE 3001
CMD [ "yarn", "dev" ]


FROM node:20-alpine3.17 AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source files, including .env
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN yarn build


FROM node:20-alpine3.17 AS production
ENV NODE_ENV=production

WORKDIR /app
RUN apk add --no-cache \
    libreoffice \
    ttf-dejavu \
    fontconfig \
    && rm -rf /var/cache/apk/*

# Define build argument
ARG DATABASE_URL

# Copy package files and install production dependencies
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Copy built files and necessary folders
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/.env ./.env

# Generate Prisma client in production environment
RUN npx prisma generate

RUN npx prisma migrate dev --name init

# Run database migrations
RUN yarn deploy

# Add seed and create-timeline commands
#RUN yarn seed && yarn create-timeline

EXPOSE 3001

# Debug: Show the final directory structure (excluding node_modules)
RUN echo "Final directory structure (excluding node_modules):" && \
    find /app -not -path "*/node_modules/*" -not -name "node_modules"

# Debug: Check file permissions
RUN ls -l /app/dist/app.js

# Debug: Print current working directory
RUN pwd

WORKDIR /app/dist

RUN mkdir -p form/tmp form/pdf upload

# Use node to run the built app.js file
CMD ["node", "app.js"]
