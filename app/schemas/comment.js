var mongoose = require('mongoose')//引入mongoose这个建模模块
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

//schema模型，数据类型
var CommentSchema = new Schema({
	movie:{type:ObjectId,ref:'Movie'},
	from:{type:ObjectId,ref:'User'},
	reply:[{
		from:{type:ObjectId,ref:'User'},
		to:{type:ObjectId,ref:'User'},
		content:String
	}],	
	content:String,
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

//每次存储数据之前都调用这个方法 pre save
CommentSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now()
	}else{
		this.meta.updateAt=Date.now()
	}

	next()
})


//静态方法，只有经过模型实例化model后才有这个方法
CommentSchema.statics={
	fetch:function(cb){
		return this
		      .find({})
		      .sort('meta.updateAt')
		      .exec(cb)//执行callback
	},
	findById:function(id,cb){
		return this
		      .findOne({_id:id})
		      .exec(cb)//执行callback
	}
}

module.exports=CommentSchema