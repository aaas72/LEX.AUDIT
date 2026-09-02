FROM node:20 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build the angular app in production mode
COPY . .
RUN npm run build -- --configuration production

# Serve the app with nginx
FROM nginx:alpine
COPY --from=build /app/dist/lex-audit-client/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
