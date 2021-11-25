FROM node:12

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
RUN npm install 
# -g
COPY . .
# ENV NODE_PATH="/usr/local/lib/node_modules"

EXPOSE 3000

CMD ["npm", "start"]
