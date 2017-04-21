module.exports=function(grunt){
	grunt.initConfig({
		watch:{
			jade:{
				files:['views/**'],
				options:{
					livereload:true // 文件改动时重启服务
				}
			},
			js:{
				files:['public/js/**','models/**/*.js','schemas/**/*.js'],
				//tasks:['jshint'],
				options:{
					livereload:true
				}
			}
		},

		nodemon:{
			dev:{
				options:{
					file:'app.js',
					args:[],
					ignoredFiles:['README.md','node_modules/**','.DS_Store'],
					watchedExtensions:['js'],
					watchedFolders:['./'],
					debug:true,
					delayTime:1,
					env:{
						PORT:3000
					},
					cwd:__dirname
				}
			}
		},

		concurrent:{
			tasks:['nodemon','watch'],
			options:{
				logConcurrentOutput:true
			}
		}
	})

	grunt.loadNpmTasks('grunt-contrib-watch') // 监控文件变化
	grunt.loadNpmTasks('grunt-nodemon') //监控入口文件app.js的变化
	grunt.loadNpmTasks('grunt-concurrent') //针对慢任务，Sass、Less等等，优化构建时间，同时用来跑多个任务，watch、nodemon

	grunt.option('force',true) //不因为警告等终止整个任务
	grunt.registerTask('default',['concurrent'])
}