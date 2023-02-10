FROM node:18.12.1-alpine
ENV NODE_ENV=production
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 4000
RUN chown -R node /usr/app
USER node
CMD ["npm", "run", "nodemon"]
