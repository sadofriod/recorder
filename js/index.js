var height = $(window).height();
$('body').height(height);
$(window).resize(function() {
	$('body').height($(window).height());
	$('body').width($(window).width())
})
$('.rightMenu').css('left', $('.leftMenu').css('width'));
$('.rightNav').css('left', $('.leftMenu').css('width'));

function userInoutValidation(userData) { //前端用户输入验证
	if(userDate.userAccount.lenght < 7) {

	}
	return true;
}

$('#login').click(function() { //欢迎页登陆逻辑
	var userData = {} //获取用户输入
	userData.password = $('#password').val();
	userData.userAccount = $('#loginUserAcount').val();
	$.post('http://127.0.0.1:3000/login', userData, function(data) { //进行数据上传
		if(JSON.parse(data)[0].success == 1) {
			$('.maskBg').addClass('maskClose');
			$('.login').addClass('closeMaskItem');
			setTimeout(function() {
				document.querySelector('.mask').style.display = 'none';
				$('.continor').removeClass('hideElement')
				$('.login').removeClass('closeMaskItem');
			}, 480);
			localStorage.loginFlag = true;
			localStorage.userAccount = userData.userAccount;
			localStorage.password = userData.password;
		}
	})
});
$('#regsiter').click(function() { //欢迎页显示至注册DIV
	$('.login').addClass('hideThisDiv');
	setTimeout(function() {
		$('.login').removeClass('maskItemActive');
		$('.regsiter').addClass('maskItemActive');
		$('.login').removeClass('hideThisDiv');
	}, 500);

});

$('#reg').click(function() { //返回欢迎页登陆
	$('.regsiter').addClass('hideThisDiv');
	var userData = {}
	userData.userName = $('#username').val();
	userData.password = $('#inputPassword').val();
	userData.userAccount = $('#userAccount').val();
	userData.Email = $('#email').val();
	$.post('http://127.0.0.1:3000/regsiter', userData, function(data) {
		userData = null;
		setTimeout(function() {
			$('.regsiter').removeClass('maskItemActive');
			$('.login').addClass('maskItemActive');
			$('.regsiter').removeClass('hideThisDiv');
		}, 500);
	});
});
$('#backLogin').click(function() { //返回欢迎页登陆
	$('.regsiter').addClass('hideThisDiv');
	var userData = {}
	userData.userName = $('#username').val();
	userData.password = $('#inputPassword').val();
	userData.userAccount = $('#userAccount').val();
	userData.Email = $('#email').val();
	setTimeout(function() {
		$('.regsiter').removeClass('maskItemActive');
		$('.login').addClass('maskItemActive');
		$('.regsiter').removeClass('hideThisDiv');
	}, 500);
});
$('#regAcount').click(function() {

});
window.onunload = function() {
	var freshTime = new Date();
	if((localStorage.day - freshTime.getDay()) < 1) {
		localStorage.loginFlag = false;
	}
}
$('.nav li').click(function() {
	$('.nav li').removeClass('active');
	$(this).addClass('active');
	$('.rightItem').removeClass('rightItemActive');
	$('.rightMenu').find('div[data-' + $(this).attr('id') + ']').addClass('rightItemActive');
});
window.onload = function() {
	//	$('#charts div canvas').height($('#charts').height());
	//	$('#charts div canvas').width($('#charts').width());
	if(localStorage.loginFlag == 'true') {
		if(localStorage.day - new Date().getDay()) {
			localStorage.day = new Date().getDay();
		}
		$('.continor').removeClass('hideElement');
		document.querySelector('.mask').style.display = 'none';
		$.post('http://127.0.0.1:3000/login', {
			userAccount: localStorage.userAccount,
			password: localStorage.password
		}, function(data) {
			console.log('Auto login');
		});
	}
	$('#uploadSuccess').attr('disabled', true);
	$('#startRecorder,#stopRecorder').attr('disabled', true);
	$('#isFales,#isTrue').attr('disabled', true);
}
$('#isTrue').click(function() {
	$.post('http://127.0.0.1:3000/updateRecorder', {
		isTrue: 1
	}, function(data) {

	});
});
$('#isFales').click(function() {
	$.post('http://127.0.0.1:3000/updateRecorder', {
		isTrue: -1
	}, function(data) {

	});
});
$('#aFales').click(function() {
	$.post('http://127.0.0.1:3000/updateRecorder', {
		isTrue: -1
	}, function(data) {
		$('#detailMsak').addClass('hideElement');

	});

});
$('#aTrue').click(function() {
	$.post('http://127.0.0.1:3000/updateRecorder', {
		isTrue: 1
	}, function(data) {
		$('#detailMsak').addClass('hideElement');

	});

});
$('#console').click(function() {
	$('#detailMsak').addClass('hideElement');
})
//$(window).resize(function() {
//	$('#charts div canvas').height($('#charts').height())
//	$('#charts div canvas').width($('#charts').width())
//})