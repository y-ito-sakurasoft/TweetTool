FROM node:8.9.4-alpine
RUN npm install --global gulp-cli

WORKDIR /home/node
RUN npm init -y
RUN npm install -–save-dev gulp@3.9.1\
    gulp-sass

CMD ["gulp"]
