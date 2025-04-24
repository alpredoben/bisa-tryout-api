# Based Image
FROM node:22.14.0-alpine

# Install System Dependencies
RUN apk update 
RUN apk add --no-cache yarn tzdata bash
RUN ln -sf /usr/share/zoneinfo/Asia/Jakarta /etc/localtime
RUN echo "Asia/Jakarta" > /etc/timezone

# Set working directory
WORKDIR /app

# Copy essential files first to optimize caching
COPY package.json ./

# Copy remaining application files
COPY . .

# Install dependencies before copying source code (leverages Docker layer caching)
RUN yarn install --frozen-lockfile

# Install development tools locally instead of globally (ensuring version consistency)
RUN yarn global add nodemon 
RUN yarn add --dev ts-node

# Define default command for development
CMD ["yarn", "dev"]
