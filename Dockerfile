# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:16-alpine as build-stage

WORKDIR /usr/src/app
COPY package*.json ./

RUN yarn

COPY . .
RUN rm ./build/ -Rf
ENV NODE_OPTIONS=--max_old_space_size=3072
RUN yarn build

HEALTHCHECK NONE
EXPOSE 8080

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginxinc/nginx-unprivileged:1.20
COPY --from=build-stage /usr/src/app/build/ /usr/share/nginx/html
COPY --from=build-stage /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
