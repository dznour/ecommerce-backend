const express = require('express')
const dbConnect = require('./config/dbConfig')
const app = express()

const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000

const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const productCategoryRouter = require('./routes/productCategoryRoute');
const blogCategoryRouter = require('./routes/blogCategoryRoute');
const brandRouter = require('./routes/brandRoute');
const colorRouter = require('./routes/colorRoute');
const couponRouter = require('./routes/couponRoute');
const enquiryRouter = require('./routes/enquiryRoute');
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
app.use('/api/product-categories', productCategoryRouter);
app.use('/api/blog-categories', blogCategoryRouter);
app.use('/api/brands', brandRouter);
app.use('/api/colors', colorRouter);
app.use('/api/coupons', couponRouter);
app.use('/api/enquiries', enquiryRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is Running at PORT: ${PORT}`)
})
