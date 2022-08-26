FROM node:14 AS builder
COPY . /srv

# build frontend
WORKDIR /srv/client
RUN npm install
RUN npm run build

# build backend
WORKDIR /srv
RUN npm install

FROM node:14-alpine AS product
COPY --from=builder /srv /srv

WORKDIR /srv
EXPOSE 8000
CMD ["node", "/srv/index.js"]