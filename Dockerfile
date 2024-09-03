FROM node:20-alpine as building

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build



FROM node:20-alpine as developement

WORKDIR /app

COPY package*.json .

RUN npm install --omit=dev

COPY --from=building /app/prisma /app/prisma

# COPY --from=building /app/logo.png /app/logo.png

COPY --from=building ./app/dist ./dist

RUN npx prisma generate

CMD [ "node","dist/main" ]