// user测试用例
var crypto = require('crypto')
var bcrypt = require('bcryptjs');

//生成一个随机用户名
function getRandomString(len){
	if(!len){
		//如果没有传长度的话默认为16
		len = 16;
	}

	return crypto.randomBytes(8) //生成伪随机码，参数为size
}

var should = require('should')
var app = require('../../app')
var mongoose = require('mongoose')
var User = require('../../app/models/user')

var user

//test
//describe:测试套件，describe('测试套件名称',function(){})
describe('<Unit Test>',function(){
	describe('Model User:',function(){
		//测试前定义user
		before(function(done){
			user = {
				name:getRandomString(),
				password:'password'
			}

			done()
		})
        
		describe('Before Method save',function(){
			//it是测试用例，只可调用一次done
			//保存前测试是否已存在同name的用户
			it('should begin without test user',function(done){
				User.find({name:user.name},function(err,users){
					users.should.have.length(0)

					done()
				})
			})
		})

		describe('User save',function(){
			//测试保存用户时没有问题
			it('should save without problems',function(done){
				var _user = new User(user)

				_user.save(function(err){
					should.not.exist(err)
					_user.remove(function(err){
						should.not.exist(err)
						done()
					})
				})
			})
 
            //测试密码被hash了,密码hash是在user save pre完成的
			it('should password be hashed currently',function(done){
				var password = user.password
				var _user = new User(user)

				_user.save(function(err){
					should.not.exist(err)
					_user.password.should.not.have.length(0)

					bcrypt.compare(password,_user.password,function(err,isMatch){
						should.not.exist(err)
						isMatch.should.equal(true)

						_user.remove(function(err){
							should.not.exist(err)
							done()
						})
					})
					
				})
			})

			//测试用户生成的时候权限是默认的0
			it('should have default role 0',function(done){
				var _user = new User(user)

				_user.save(function(err){
					_user.role.should.equal(0)

					_user.remove(function(err){
						done()
					})	
				})
			})

			//测试save同名用户时失败
			it('should fail to save an exiting user',function(done){
				var _user1 = new User(user)

				_user1.save(function(err){
					should.not.exist(err)
					var _user2 = new User(user)

					_user2.save(function(err){
						should.exist(err)

						_user1.remove(function(err){
							if(!err){
								_user2.remove(function(err){
									done()
								})
							}
						})
					})
				})
			})
		})

        //测试跑完之后做的事，例如清除user信息
        after(function(done){
        	// clear user info
        	done()
        })
	})
})