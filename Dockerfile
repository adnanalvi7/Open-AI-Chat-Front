FROM node:20

WORKDIR /app

COPY package*.json ./
COPY yarn.lock* ./
COPY pnpm-lock.yaml* ./

RUN npm install --frozen-lockfile || \
    yarn install --frozen-lockfile || \
    pnpm install --frozen-lockfile

COPY . .

RUN npm run build || \
    yarn build || \
    pnpm build

FROM nginx:1.25-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]