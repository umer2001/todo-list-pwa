FROM node:14.17-alpine3.11 as build

ENV REACT_APP_ENVIRONMENT=production

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

RUN npm run build

# production environment

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

# new

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]