var express=require('express')
var path=require('path')
var serveStatic = require('serve-static')
var bodyParser = require('body-parser')
var session=require('express-session')//注意：要把session定义在mongoose前面
var cookieParser=require('cookie-parser')//从cookie中获取sessionid
var mongoose = require('mongoose')
var mongoStore=require('connect-mongo')(session)//session持久化，将session存在mongo中
var port=process.env.PORT||3000
var app=express()
var dbUrl='mongodb://localhost/test'

mongoose.connect(dbUrl)

//app.set('/views','./views/pages')
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine','jade')
app.use(bodyParser.urlencoded())
app.use(cookieParser())
app.use(session({
	secret:'imooc',
	store:new mongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}))

require('./config/routes')(app)

app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment=require('moment')
app.listen(port)

console.log('start on port '+port)

