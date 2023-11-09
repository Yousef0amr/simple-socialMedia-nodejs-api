require("dotenv").config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require("mongoose");
const authJwt = require('./middlewares/expressJwt')
const api = process.env.BASE_URL
const app = express();
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const postRouter = require('./routes/posts')
//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(authJwt)



// routes
app.use(`${api}/auth`, authRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/posts`, postRouter);



app.all('*', (req, res) => {
    res.json({ status: 'ERROR', message: "this resource not found" })
})

app.use((error, req, res, next) => {
    res.json({ status: 'ERROR', data: null, message: error.message })
})

mongoose.connect(process.env.MONGO_URL)
    .then(app.listen(process.env.PORT))
    .then(() => console.log(`listning to port ${process.env.PORT} and connected to mongodb `))
    .catch((e) => console.log(e));