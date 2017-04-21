var _=require('underscore')//引入extend，新object替换旧object中的字段
var Movie=require('../models/movie')
var User=require('../models/user')


module.exports=function(app){
	//pre handle user
app.use(function(req,res,next){
	app.locals.user=req.session.user;
	next();
})

//index page
app.get('/',function(req,res){
	app.locals.user=req.session.user;

	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}

		res.render('index',{
		title:'首页',
		movies:movies
	})
	})
	
})

//signup page
app.post('/user/signup',function(req,res){
	var _user=req.body.user;

	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}

		if(user){
			return res.redirect('/')
		}else{
			var user=new User(_user);

			user.save(function(err,user){
				if(err){
					console.log(err);
				}

				res.redirect('/admin/userlist')
		    })
		}
	})
})

//signin page
app.post('/user/signin',function(req,res){
	var _user=req.body.user;
	var name=_user.name;
	var password=_user.password;

	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err)
		}

		if(!user){
			return res.redirect('/')
		}

		//对比密码是否正确
		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err);
			}

			if(isMatch){
				//将用户登录信息存入session中
				req.session.user=user;
				return res.redirect('/')
			}else{
				console.log('password is not matched')
			}
		})
	})
})

//logout 登出
app.get('/logout',function(req,res){
	delete req.session.user;

	res.redirect('/')
})

//userlist page
app.get('/admin/userlist',function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}

		res.render('userlist',{
			title:'用户列表页面',
			users:users
		})
	})
})

//detail page
app.get('/movie/:id',function(req,res){
	var id=req.params.id
	Movie.findById(id,function(err,movie){
	    res.render('detail',{
			title:'详情页面'+movie.title,
			movie:movie
		})
	})
	
})

//admin page
app.get('/admin/new',function(req,res){
	res.render('admin',{
		title:'后台录入页面',
		movie:{
			title:'',
			doctor:'',
			country:'',
			year:'',
			poster:'',
			flash:'',
			summary:'',
			language:''
		}
	})
})

//admin update movie
app.get('/admin/update/:id',function(req,res){
	var id=req.params.id

	if(id){
		Movie.findById(id,function(err,movie){
				res.render('admin',{
					title:'后台更新页面',
					movie:movie
				})
		})
	}
})

//admin post movie
app.post('/admin/new',function(req,res){
	var id=req.body.movie._id
	var movieObj=req.body.movie
	var _movie

	if(id!=='undefined'){
		//已存在该电影，更新
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}

			_movie=_.extend(movie,movieObj);
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}

				res.redirect('/movie/'+movie._id)
			})
		})
	}else{
		//不存在该电影，新传入
		_movie=new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash
		})

		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}

			res.redirect('/movie/'+movie._id)
		})
	}
})

//list page
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}

		res.render('list',{
			title:'列表页面',
			movies:movies
		})
	})
})

//list delete movie
app.delete('/admin/list',function(req,res){
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
})
}