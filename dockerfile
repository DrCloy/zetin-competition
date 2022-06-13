FROM node:14-alpine

RUN apk update
RUN apk add git

# clone zetin-competition repository
WORKDIR /
RUN git clone https://github.com/shythm/zetin-competition.git

# build react frontend
WORKDIR /zetin-competition/client
RUN npm install
RUN npm run build

# backend
WORKDIR /zetin-competition
RUN npm install

EXPOSE 8000
CMD ["node", "/zetin-competition/index.js"]