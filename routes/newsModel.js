const express = require('express')
const newsRoute = express.Router();

const protect = require('../middleware/auth-middleware')

const { addNews } = require('../controller/newsModel')

newsRoute.route('/').post( protect, addNews)

module.exports = newsRoute;