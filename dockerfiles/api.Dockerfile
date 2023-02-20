###################################################################
# Stage 1: Build the app                                          #
###################################################################
FROM node:18.14-alpine3.17 as builder

# Install binaries
RUN npm install -g pnpm

# Prepare and build the install dependency
WORKDIR /app
COPY . .
RUN pnpm install --filter=api... --prefer-offline --frozen-lockfile --shamefully-hoist --config.fetch-timeout=10000000 && \
    cp -Lr ./node_modules ./node_modules_temp && \
    rm -rf ./node_modules_temp/.cache && \
    rm -rf ./node_modules_temp/.pnpm

RUN pnpm --filter=api... build

###################################################################
# Stage 2: Extract a minimal image from the build                 #
###################################################################
FROM node:18.14-alpine3.17 as runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 reactjs

COPY --from=builder --chown=reactjs:nodejs /app/packages/api/dist ./dist

# WORKAROUND FOR: https://github.com/vercel/next.js/discussions/39432
COPY --from=builder /app/node_modules_temp ./node_modules

USER reactjs

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["node"]

CMD ["dist/index.js"]