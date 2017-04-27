var mongoose = require('mongoose')//引入mongoose这个建模模块
var CommentSchema = require('../schemas/comment')
//Model —— 由Schema构造生成的模型，除了Schema定义的数据库骨架以外，还具有数据库操作的行为，类似于管理数据库属性、行为的类。
//数据库中的集合名称,当我们对其添加数据时如果Movie已经存在，则会保存到其目录下，如果未存在，则会创建Movie集合，然后在保存数据。
var Comment = mongoose.model('Comment',CommentSchema)

module.exports=Comment