# A Nodejs server api for Crevance/Fundall


## Requirement ##
* [MongoDB](https://www.mongodb.com/) - Our Database v3.2
* [Expressjs](http://expressjs.com/zh-tw/) - API Server
* [Nodejs](https://nodejs.org/en/) - Backend Framework v7.1.0
* [NPM](https://www.npmjs.com/) - Package Management v3.10.9

## System Environment Variables ##
* `PORT`
* `SECRET_KEY`
* `MONGO_CONNECTION`


## Install dependencies packages ##
```
$ cd Crevance
$ npm install
```

## Config ##
* `/config/database.js` database and jwt secret configuration, default using system variables
>1. secret - jwt auth secret
>2. database - database connection

## Packages ##
>1. [Mongoose](http://mongoosejs.com/) - mongodb object modeling
>2. [Simple JWT](https://www.npmjs.com/package/jwt-simple) - token use
>3. [Morgan](https://github.com/expressjs/morgan) - HTTP request logger middleware for node.js
>4. [moment](http://momentjs.com/docs/) - date parse
>5. [bcrypt-nodejs](https://www.npmjs.com/package/bcrypt-nodejs) - ecrypt password

## Step ##
### General config
>1. edit /config/database.js or system variable for `MONGO_CONNECTION`、`SECRET_KEY` - database connection and jwt secret
>2. edit /config/initial.js - super admin account and role's permissions
>3. export `API_ENDPOINT` with system variable, allow client connection with server endpoint.
### Start with development
>1. server development: `npm run dev:server`

### Production build and run
>2. `npm start`
