var express = require('express'); //erpress 框架引入
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser'); //引入body-parser中间件
var fileUpload = require('express-fileupload'); //引入基于express的文件上传
var urlencodeParser = bodyParser.urlencoded({
	extended: true
}); //配置上传的文件类型 当前为任意类型
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	database: 'student'
});
app.use(express.static('C:/Users/79263/Desktop/Recorderjs')); //配置服务器本机地址
app.get('/index.html', function(req, res) {
	res.send(__dirname + "/" + "index.html");
}); //默认访问index.html
var userdata; //测试使用本地用户数据，引入数据库后删除
app.post('/regsiter', urlencodeParser, function(req, res) { //用户注册逻辑
	var response = {
		id: null,
		userFirstname: req.body.userName,
		user_name: req.body.userAccount,
		Email: req.body.Email,
		password: req.body.password
	};
	connection.query("insert into userinformation set ?", response, function(err, result) {
		if(err) {
			console.log(err.message);
		}
		console.log(JSON.stringify(result));
		res.json(JSON.stringify(result));
		return result;
	});
});
app.post('/login', urlencodeParser, function(req, res) { //用户登陆逻辑
	var response = {
		userName: req.body.userAccount,
		password: req.body.password
	};

	var rp = response;
	connection.query("select * from userinformation where user_name='" + rp.userName + "' and password='" + rp.password + "'", function(err, result) {
		if(err) {
			console.log(err.message);
		}
		result[0].success = 1;
		console.log(JSON.stringify(result));
		res.json(JSON.stringify(result));
		return result;
	});
});
app.use(fileUpload({
	safeFileNames: true,
	preserveExtension: true
})) //配置文件上传中间件
app.post('/upload', function(req, res) {
	var date = new Date();
	var response = {
		id: null,
		recorderFileName: date.getFullYear() + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + ".wav",
		recorderFilePath: "http://127.0.0.1:3000/js/" + req.body.userAccount + "/" + date.getFullYear() + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + ".wav",
		userId: req.body.userAccount
	}
	if(!req.files) {
		console.log("not file");
		return res.status(400);
	} else {
		console.log("is file");
	}
	var sampleFile = req.files;
	sampleFile.customField.name = date.toISOString(); //为文件命名
	if(!fs.existsSync("./" + req.body.userAccount)) {
		fs.mkdirSync("./" + req.body.userAccount)
	}
	console.log(sampleFile.customField);
	console.log(req.body.userAccount);
	//	wavSolve(res);
	var path = "./" + req.body.userAccount + "/" + date.getFullYear() + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + ".wav"; //文件真实名称
	req.files.customField.mv(path, function(err) { //移动文件至服务器下目录
		if(err) {
			return res.status(500);
		}
	});
	connection.query("insert into recorder set ?", response, function(err, result) {
		if(err) {
			console.log(err.message);
		}
		console.log(JSON.parse(JSON.stringify(result)).insertId);
		res.json({
			"success": 1,
			"insertId": JSON.parse(JSON.stringify(result)).insertId
		});

		return result;
	});
});
app.post('/uploadImage', urlencodeParser, function(req, res) {
	var date = new Date();
	//	console.log(req.body.imgUrl !== undefined)
	var i;
	if(req.body.imgUrl !== undefined) {
		var imgByte = req.body.imgUrl.split(',')[1];
		var response = {
		id: null,
		imageUrl: 'data:image/png;base64,'+imgByte,
		recorderId: req.body.recorderId,
		userId: req.body.userId
	}
	}
	try {
		var buf = Buffer.allocUnsafe(imgByte.length);
		var imgData = buf.write(imgByte);
	} catch(e) {
		//TODO handle the exception
	}

	console.log(buf);
	fs.appendFile('C:/Users/79263/Desktop/Recorderjs/js/temp/' + date.getFullYear() + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + '.txt', imgByte, "base64",function(err) {
		if(err) {
			console.log(err)
		}
//		fs.writeFile('C:/Users/79263/Desktop/Recorderjs/js/temp/' + date.getFullYear() + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + '.png', buf, "base64",function(err) {
//			if(err) {
//				console.log(err)
//			}
//		})
	})
	connection.query("insert into image set ?", response, function(err, result) {
		if(err) {
			console.log(err.message);
		}
		console.log(JSON.stringify(result));
		res.json({
			"success": 1,
			"url": 'C:/Users/79263/Desktop/Recorderjs/js/temp/' + date.getFullYear() + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + '.txt'
		});
		return result;
	});
});
app.post('/updateRecorder', urlencodeParser, function(req, res) {
	var sqlData = [
		req.body.isTrue
	]
	console.log(req.body);
	var sql = "update recorder,(select id from recorder ORDER BY id desc limit 0,1)temp set isTrue=? where recorder.id= temp.id";
	connection.query(sql, sqlData, function(err, result) {
		if(err) {
			console.log(err.message);
		}
		console.log(JSON.stringify(result));
		res.json(JSON.stringify(result));
		return result;
	});
});
app.post('/selectAllRecorder', urlencodeParser, function(req, res) {
	var sql = "select * from recorder,image where image.recorderId = recorder.id";
	connection.query(sql, function(err, result) {
		if(err) {
			console.log(err.message);
		}
		res.json(JSON.stringify(result));
		return result;
	});
});
var server = app.listen(3000, function() { //启动服务
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});

function wavSolve(res) {
	var exec = require('child_process').exec;
	var exec_path = "java -jar test.jar";
	var data;
	exec(exec_path, function(err, stdout, stderr) {
		console.log('sjdhaskhd');
		console.log(err, stdout, stderr);
		data = "{ercode:0,errms'" + stdout + "'}"
	})
}
//update recorder,(select id from recorder ORDER BY id desc limt 0,1)temp set isTrue=1 where id= temp.id