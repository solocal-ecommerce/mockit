FROM node:11.4.0-alpine
RUN mkdir -p /usr/src/mockit-client
WORKDIR /usr/src/mockit-client

COPY package.json .
COPY package-lock.json .

RUN echo "nameserver 169.254.169.254" >> /etc/resolv.conf && npm ci

COPY . ./


CMD ["npm", "start"]
