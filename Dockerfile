# Step 1

#FROM node:10-alpine as build-step

#RUN mkdir /app

#WORKDIR /app

#COPY package.json /app

#RUN npm install

#COPY . /app

#RUN npm run build

# Stage 2

#FROM nginx:1.17.1-alpine

#COPY --from=build-step /app/build /usr/share/nginx/html
#EXPOSE 3000



#docker build -t wizard-front .
#docker run -it --rm -p 3000:3000/tcp --name wizard-front-app wizard-front
#docker stop wizard-front-app
#docker rm wizard-front-app

# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g

# add app
COPY . ./

# start app
CMD ["npm", "start"]
