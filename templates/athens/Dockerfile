FROM node:20-alpine AS base
WORKDIR /repo

# Dependencies
FROM base AS deps

RUN apk add --no-cache libc6-compat curl

RUN npm install -g pnpm@9.0.0

# Copy necessary files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages ./packages
COPY templates/athens ./templates/athens/

# Install deps with correct pnpm version
RUN pnpm install --frozen-lockfile

# Build
FROM deps AS builder
ENV NEXT_PUBLIC_STORE_SLUG=NEXT_PUBLIC_STORE_SLUG
ENV NEXT_PUBLIC_STORE_ID=NEXT_PUBLIC_STORE_ID
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=NEXT_PUBLIC_RAZORPAY_KEY_ID
RUN pnpm turbo run build --filter=athens...

# Final image
FROM node:20-alpine AS runner
ENV HOSTNAME=0.0.0.0
ENV TEMPLATE_DIR=athens
WORKDIR /app
COPY --from=builder /repo/templates/athens/.next/standalone ./
COPY --from=builder /repo/templates/athens/.next/static ./templates/athens/.next/static
COPY entrypoint.sh ./templates/athens/entrypoint.sh
RUN chmod +x ./templates/athens/entrypoint.sh
ENTRYPOINT ["./templates/athens/entrypoint.sh"]
EXPOSE 3000
CMD ["node", "templates/athens/server.js"]