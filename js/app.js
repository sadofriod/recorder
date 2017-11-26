var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var urlencodeParser = bodyParser.urlencoded({extended:true});
app.use(express.static('C:/Users/79263/Desktop/Recorderjs'));
app.get('/index.html', function (req, res) {
  res.send(__dirname+"/"+"index.html");
});
var userdata;//测试使用本地用户数据
app.post('/regsiter',urlencodeParser,function(req,res){
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
app.post('/login',urlencodeParser,function(req,res){
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
app.use(fileUpload());

app.post('/upload', function(req, res) {
  var date = new Date();
  if(!req.files){
    return res.status(400);
  }
  var sampleFile = req.files;
  sampleFile.customField.mv("C:/Users/79263/Desktop/Recorderjs/temp/date.wav",function(err){
    if(err){
      return res.status(500);
    }
  });
  console.log( sampleFile.customField.data);
  // sampleFile.customField.mv("C:\Users\79263\Desktop\Recorderjs\temp")
});
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});