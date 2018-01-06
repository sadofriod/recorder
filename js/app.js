var express = require('express');//erpress 框架引入
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');//引入body-parser中间件
var fileUpload = require('express-fileupload');//引入基于express的文件上传
var urlencodeParser = bodyParser.urlencoded({extended:true});//配置上传的文件类型 当前为任意类型

app.use(express.static('C:/Users/79263/Desktop/Recorderjs'));//配置服务器本机地址
app.get('/index.html', function (req, res) {
  res.send(__dirname+"/"+"index.html");
});//默认访问index.html
var userdata;//测试使用本地用户数据，引入数据库后删除
app.post('/regsiter',urlencodeParser,function(req,res){//用户注册逻辑
  var response = {
    "userName":req.body.userName,
    "userAccount":req.body.userAccount,
    "Email":req.body.Email,
    "password":req.body.password
  };
  console.log(response);
  res.end(JSON.stringify(response));
  userdata = JSON.stringify(response);
});
app.post('/login',urlencodeParser,function(req,res){//用户登陆逻辑
  var response = {
    userAccount:req.body.userAccount,
    password:req.body.password
  };
  response = JSON.stringify(response);
  if(response.userAccount == userdata.userAccount&&response.password == userdata.password){
    res.json({success:1});
    console.log('login success');
  }
  else{
    console.log(response);
    console.log(userdata);
  }
});
app.use(fileUpload({ safeFileNames: true, preserveExtension: true }))//配置文件上传中间件
app.post('/upload', function(req, res) {
  var date = new Date();
  var ud = JSON.parse(userdata)
  if(!req.files){
    console.log("not file");
    return res.status(400);
  }
  else{
    console.log("is file");
  }
  var sampleFile = req.files;
  sampleFile.customField.name = date.toISOString();//为文件命名
  if(!fs.existsSync("./"+ud.userAccount)){
    fs.mkdirSync("./"+ud.userAccount)
  }
  console.log(sampleFile.customField);
  wavSolve(res);
  var path = "./"+ud.userAccount+"/"+date.getFullYear()+"-"+date.getDate()+"-"+date.getHours()+"-"+date.getMinutes()+"-"+date.getSeconds()+".wav";//文件真实名称
  req.files.customField.mv(path,function(err){//移动文件至服务器下目录
    if(err){
      return res.status(500);
    }
    
    return res.send('success');
  });
  return res.status(200);
});
var server = app.listen(3000, function () {//启动服务
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
function  wavSolve(res){
  var exec = require('child_process').exec;
  var exec_path = "java -jar test.jar";
  var data;
 exec(exec_path,function(err,stdout,stderr){
    console.log('sjdhaskhd');
    console.log(err, stdout, stderr);
    data = "{ercode:0,errms'"+stdout+"'}"
  })
  console.log('ssssss');
}