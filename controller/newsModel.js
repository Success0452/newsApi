const { StatusCodes } = require('http-status-codes');
const imageTo64 = require('image-to-base64');
const News = require('../model/newsModel');
const BadRequestError = require('../errors/bad-request')

const addNews = async(req, res, next) => {

    try {
        
        const { author, title, content, category, addSliders  } = req.body

        const base64Data = await imageTo64(req.files.newImage.path)
        
        const news = await News.create({author, title, content, category, addSliders, newsImage: `data: ${req.files.newImage.type}; base64, ${base64Data}`, addedAt: Date.now() });
    
        if(news){
            return res.status(StatusCodes.CREATED).json({
                success: true,
                msg: 'news created successfully',
                data: news
            })
        }else{
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: true,
                msg: 'problem encountered storing news',
                data: news
            })
        }

    } catch (error) {
        throw new BadRequestError('Error connecting to Server')
    }
} 

module.exports = {
    addNews
};