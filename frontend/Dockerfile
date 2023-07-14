FROM node
WORKDIR /app

COPY . .
RUN yarn && yarn build
CMD yarn preview --host
EXPOSE 4173
