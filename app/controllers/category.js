var Category=require('../models/category')

//admin new page
exports.new = function(req,res){
	res.render('category-admin',{
		title:'后台电影分类录入页面',
		category:{}
	})
}

//admin post movie
exports.save = function(req,res){
	var _category=req.body.category
	var category=new Category(_category)

	category.save(function(err,category){
		if(err){
			console.log(err)
		}

		res.redirect('/admin/category/list')
	})
}

//list page
exports.list = function(req,res){
	Category.fetch(function(err,categories){
		if(err){
			console.log(err)
		}

		res.render('categorylist',{
			title:'电影分类列表页面',
			categories:categories
		})
	})
}

//list delete movie
exports.del = function(req,res){
	var id=req.query.id

	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}
		})
	}
}