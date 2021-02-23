FROM node:11.4.0-alpine

RUN mkdir -p /usr/src/mockit-server
WORKDIR /usr/src/mockit-server

COPY package.json .
COPY package-lock.json .

RUN echo "nameserver 169.254.169.254" >> /etc/resolv.conf && npm ci

COPY . .

EXPOSE 4000

CMD ["npm", "start"]