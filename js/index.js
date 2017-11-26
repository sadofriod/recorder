var height = $(window).height();
$('body').height(height);
$(window).resize(function(){
	$('body').height($(window).height());
	$('body').width($(window).width())
})
$('#login').click(function(){
	var userData = {
		password:$('#password').val(),
		userAccount:$('#userAccount').val()
	}
	$.post('http://127.0.0.1:3000/login',userData,function(data){
		console.log(data);
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
$('#regsiter').click(function(){
	
	$('.login').addClass('hideThisDiv');
	setTimeout(function(){
		$('.login').removeClass('maskItemActive');
		$('.regsiter').addClass('maskItemActive');
		$('.login').removeClass('hideThisDiv');
	},500);
	
});

$('#reg,#backLogin').click(function(){
	$('.regsiter').addClass('hideThisDiv');
	var userData = {
		userName:$('#username').val(),
		password:$('#inputPassword').val(),
		userAccount:$('#userAccount').val(),
		Email:$('#email').val()
	}
	setTimeout(function(){
		$('.regsiter').removeClass('maskItemActive');
		$('.login').addClass('maskItemActive');
		$('.regsiter').removeClass('hideThisDiv');
	},500);
	$.post('http://127.0.0.1:3000/regsiter',userData,function(data){
		console.log(data);
	})
});
$('#regAcount').click(function(){
	
});