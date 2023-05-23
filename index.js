const express = require('express')
const dbConnect = require('./config/dbConfig')
const app = express()

const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000

const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const bodyParser = require('body-parser')
const { notFound, errorHandler } = require('./middlewares/errorHandler')
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
dbConnect();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/blogs', blogRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is Running at PORT: ${PORT}`)
})
