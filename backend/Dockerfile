FROM node
WORKDIR /app

COPY . .
RUN yarn && yarn build
CMD yarn start:prod
EXPOSE 3000
