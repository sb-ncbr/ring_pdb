FROM node:20-slim as frontend

WORKDIR /build

COPY ./frontend/package.json ./frontend/package-lock.json /build/

RUN npm install

COPY ./frontend /build

RUN ./node_modules/.bin/tsc

RUN npm run build

FROM nginx:1.26-alpine-slim

COPY --from=frontend /build/assets /var/www/assets

COPY --from=frontend /build/*.html /var/www/
 
CMD ["nginx", "-g", "daemon off;"]
