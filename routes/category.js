const express= require('express')

const CategoryRoute = express();

const {
    addCategory,
    getAllCategories,
    deleteCategory,
    editCategory
} = require('../controller/category')


CategoryRoute.route('/addCategory').post(addCategory);
CategoryRoute.route('/getAll').get(getAllCategories);
CategoryRoute.route('/:catid').delete(deleteCategory).patch(editCategory);



module.exports = CategoryRoute;