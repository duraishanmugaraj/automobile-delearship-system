# automobile-delearship-system

Automobile delearship System is a web application developed to provide digital retail services to automotive dealerships in order to facilitate zero-contact sales and services This is implemented using Node.js and MongoDB.

Checkout -> https://wizcarz.herokuapp.com/

## Features

- Discover the currently popular movies.
- Search movies using movie name in homepage.
- View movie storyline, release date , watch time , information etc. from movie pages.

## Technologies Used

- [ejs](https://ejs.co/) for templating
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Passport.js](http://www.passportjs.org/) for authentication and session tracking
- [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/) for Designing the webpage

## Login Page
![image](https://user-images.githubusercontent.com/68941801/132941384-e9289829-9838-48fc-bffc-9cfa58bbc4c0.png)

## Admin 
![image](https://user-images.githubusercontent.com/68941801/132941402-3ec7e6f8-283e-4017-b148-f28b88a5f27e.png)
![image](https://user-images.githubusercontent.com/68941801/132941405-02f9932f-7d90-4435-9f4f-88ba54574562.png)

## User
![image](https://user-images.githubusercontent.com/68941801/132941426-af7ff2ce-546b-431a-be3b-5b8dfb3c7ed6.png)

#### General
1. Install Dependencies using `npm install`
2. Make sure `MongoDB` server is running
3. Create all the required `collections` and fill in the data from `db_data`


#### Local
1. Inside  `--> app.js` under MongoDB section, replace the url with `mongodb://localhost:27017/automobileDB`
2. Open Terminal in the app folder
3. Run `npm start` or `nodemon start` (if nodemon is preinstalled)
4. Launch client app in `localhost:3000`


