var User=require('../models/user')

//show signup page
exports.showSignup = function(req,res){
	res.render('signup',{
		title:'注册页面'
	})
}

//show signin page
exports.showSignin = function(req,res){
	res.render('signin',{
		title:'登录页面'
	})
}

//signup page
exports.signup = function(req,res){
	var _user=req.body.user;

	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}

		if(user){
			return res.redirect('/signin')
		}else{
			var user=new User(_user);

			user.save(function(err,user){
				if(err){
					console.log(err);
				}

				res.redirect('/')
		    })
		}
	})
}

//signin page
exports.signin = function(req,res){
	var _user=req.body.user;
	var name=_user.name;
	var password=_user.password;

	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err)
		}

		if(!user){
			return res.redirect('/signup')
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
				return res.redirect('/signin')
			}
		})
	})
}

//logout 登出
exports.logout = function(req,res){
	delete req.session.user;

	res.redirect('/')
}

//userlist page
exports.list = function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}

		res.render('userlist',{
			title:'用户列表页面',
			users:users
		})
	})
}

//midware for user
exports.signinRequired = function(req,res,next){
	var user = req.session.user;

	if(!user){
		return res.redirect('/signin')
	}

	next();
}

exports.adminRequired = function(req,res,next){
	var user = req.session.user;

	if(user.role<=10){
		return res.redirect('/signin')
	}

	next();
}