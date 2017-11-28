var height = $(window).height();
$('body').height(height);
$(window).resize(function(){
	$('body').height($(window).height());
	$('body').width($(window).width())
})
function userInoutValidation(userData){//前端用户输入验证
	if(userDate.userAccount.lenght < 7){

	}
	return true;
}
$('#login').click(function(){//欢迎页登陆逻辑
	var userData = {}//获取用户输入
	userData.password = $('#password').val(),
	userData.userAccount = $('#userAccount').val()
	$.post('http://127.0.0.1:3000/login',userData,function(data){//进行数据上传
		userData = null;
		if(data.success==1){
			$('.maskBg').addClass('maskClose');
			$('.login').addClass('closeMaskItem');
			setTimeout(function(){
				document.querySelector('.mask').style.display = 'none';
				document.querySelector('.maskBg').style.display = 'none';
				$('.login').removeClass('closeMaskItem');
			},480);
		}
	})
});
$('#regsiter').click(function(){//欢迎页显示至注册DIV
	
	$('.login').addClass('hideThisDiv');
	setTimeout(function(){
		$('.login').removeClass('maskItemActive');
		$('.regsiter').addClass('maskItemActive');
		$('.login').removeClass('hideThisDiv');
	},500);
	
});

$('#reg,#backLogin').click(function(){//返回欢迎页登陆
	$('.regsiter').addClass('hideThisDiv');
	var userData = {}
	userData.userName = $('#username').val(),
	userData.password = $('#inputPassword').val(),
	userData.userAccount = $('#userAccount').val(),
	userData.Email = $('#email').val()
	setTimeout(function(){
		$('.regsiter').removeClass('maskItemActive');
		$('.login').addClass('maskItemActive');
		$('.regsiter').removeClass('hideThisDiv');
	},500);
	$.post('http://127.0.0.1:3000/regsiter',userData,function(data){
		userData = null;
	});
});
$('#regAcount').click(function(){
	
});