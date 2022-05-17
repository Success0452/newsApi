const Category = require('../model/category')
const {StatusCodes} = require('http-status-codes')
const  BadRequestError  = require('../errors/bad-request')

const addCategory = async(req, res) => {
    
  try {
    
    const category = await Category.findOne({category_name: category_name})
    console.log( req.body.category_name)
    if(category){
        throw new BadRequestError('Category does not exist'); 
    }

    const new_category = await Category.create({category_name: category_name})

    return res.status(StatusCodes.OK).json({
        success: true,
        data: new_category,
        msg: 'Category Created Successfully'
    })

  } catch (error) {
      throw new BadRequestError(`Unable to create category ${error}`)     
  }
}


const getAllCategories = async(req, res, next) => {
    
    try {

        const categories = await Category.find({})

        return res.status(StatusCodes.OK).json({
            success: true,
            data: categories
        })
        
    } catch (error) {
        throw new BadRequestError('Unable to get all category');   
    }

}

const deleteCategory = async(req, res, next) => {

    try {

        const category = await Category.findByIdAndDelete(req.params.catid, {
            runValidators: true,
            new: true
        });

        if(!category){
            throw new BadRequestError('Category does not exist'); 
        }

        return res.status(StatusCodes.OK).json({
            msg: 'Successfully deleted',
            success: true,
            data: category 
        })

        
    } catch (error) {
        throw new BadRequestError('Unable to delete category'); 
    }
}

const editCategory = async(req, res, next) => {

   try {
    const { catid } = req.params
    const category = await Category.findOneAndUpdate({catid }, req.body, {
        new: true,
        runValidators: true
    })

    if(!category){
        throw new BadRequestError('cannot find category'); 
    }

    return res.status(StatusCodes.OK).json({
        msg: 'Successful',
        success: true,
        data: category,
    })

   } catch (error) {
    throw new BadRequestError('Unable to update category'); 
   }

}

module.exports = {
    addCategory,
    getAllCategories,
    deleteCategory, 
    editCategory
}