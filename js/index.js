var height = $(window).height();
$('body').height(height);
$('#login').click(function(){
//	$('.login').addClass('hideThisDiv');
	$('.maskBg').addClass('maskClose');
	$('.login').addClass('closeMaskItem');
	setTimeout(function(){
//		$('.login').removeClass('maskItemActive');
//		$('.regsiter').addClass('maskItemActive');
		document.querySelector('.mask').style.display = 'none';
		document.querySelector('.maskBg').style.display = 'none';
		$('.login').removeClass('closeMaskItem');
	},480);
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
	setTimeout(function(){
		$('.regsiter').removeClass('maskItemActive');
		$('.login').addClass('maskItemActive');
		$('.regsiter').removeClass('hideThisDiv');
	},500);
});
$('#regAcount').click(function(){
	
});