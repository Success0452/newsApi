require('dotenv').config();
require('colors')
require('express-async-errors');

const formData = require('express-form-data')
const morgan = require('morgan');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

const userRoute = require('./routes/auth');
const categoryRoute = require('./routes/category')
const newsRoute = require('./routes/newsModel')

const express = require('express');
const ConnectDB = require('./db/connect');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(formData.parse())

app.use('/api/v1', userRoute);
app.use('/api/v1/category', categoryRoute)
app.use('/api/vi/news', newsRoute)

app.get('/', (req, res) => {
    return res.status(200).json({data: req.body});
})

app.get('*', (req, res) => {
    return res.status(200).json({msg: "page does not exist"})
})


app.use(notFound);
app.use(errorHandler);

if(process.env.NODE_ENV === "development")
app.use(morgan('dev'))

const port = process.env.PORT || 3000

const start = async() => {
    try {
        // ConnectDB
        await ConnectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Server is listening on port ${port} and connected in ${process.env.NODE_ENV} mode....` .red))

    } catch (error) {
        console.log(error);       
    }
}

start();