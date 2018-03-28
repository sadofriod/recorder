//function __log(e, data) {
//	log.innerHTML += "\n" + e + " " + (data || '');
//}

var audio_context;
var recorder;
var animationFlag
var downloadLink;
var removeFlag;
var downloadUrl;
var ipAddress = '127.0.0.1'
function startUserMedia(stream) {
	var input = audio_context.createMediaStreamSource(stream);
	//	__log('Media stream created.');

	// Uncomment if you want the audio to feedback directly
	//input.connect(audio_context.destination);
	//__log('Input connected to audio context destination.');

	recorder = new Recorder(input);
	//	__log('Recorder initialised.');
}
var timeFlag;

function recordTime() {
	var i = 0,
		k = 0;
	var str = null;
	timeFlag = setInterval(function () {
		if (k < 1 && i < 10) {
			str = '00:' + '0' + i;
		} else if (i == 60 && k < 10) {
			k += 1;
			i = 0;
			str = '0' + k + ':00';
			k++;
		} else if (i == 60 && k > 10) {
			k += 1;
			i = 0;
			str = k + ':00';
			k++
		} else if (i >= 10 && k < 10) {
			str = '0' + k + ':' + i
		} else {
			str = k + ':' + i
		}
		i++;
		$('.recordTime h2').html(str);
	}, 1000)

}
$('#uploadSuccess').click(function () {
	$('#uploadMask').addClass('hideElement');
	$('#isFales,#isTrue').attr('disabled', false);
});

function uploadAnimation() {
	var str = '。';
	var j = 0;
	$('#uploadMask').removeClass('hideElement')
	animationFlag = setInterval(function () {
		$('.maskContext h2').html(str)
		if (j == 5) {
			str = '。';
			j = 0
		} else {
			str += '。'
			j++;
		}

	}, 800)
}

function createImage(words) {
	$('#content').html(null);
	$('#content').append('<p>'+words+'</p>');
	html2canvas(document.getElementById('content'), {
		onrendered: function (canvas) {
			$('#content').append(canvas);
			$('#content').find('canvas').hide();
			url = canvas.toDataURL(); //图片地址
			$('#content').append('<img src="' + url + '" />')
			$('#content p').hide();
			uploadImage(url);
		},
	});
}

function startRecording(button) {
	recorder && recorder.record();
	button.disabled = true;
	button.nextElementSibling.disabled = false;
	//	__log('Recording...');
	recordTime()
}

function stopRecording(button) {
	recorder && recorder.stop();
	button.disabled = true;
	button.previousElementSibling.disabled = false;
	//	__log('Stopped recording.');

	// create WAV download link using audio data blob

	createDownloadLink();
	recorder.clear();
	clearInterval(timeFlag);
	uploadAnimation();
	// createImage();

}

function upload_file(blob) { //通过post上传文件
	var xhr = new XMLHttpRequest();
	var formData = new FormData();
	var date = new Date();
	console.log(blob);
	// recorder.exportWAV(function(blob) {
	var fd = new FormData();
	fd.append("customField", blob);
	console.log();
	// fd.append("data",blob);
	fd.append("name", date.toISOString());
	fd.append("userAccount", localStorage.userAccount);
	$.ajax({
		url: "/upload",
		type: "POST",
		data: fd,
		cache: false,
		processData: false, //  告诉jquery不要处理发送的数据
		contentType: false, // 告诉jquery不要设置content-Type请求头
		success: function (result) {
			if (eval(result).success == 1) {
				clearInterval(animationFlag);
				$('#uploadSuccess').attr('disabled', false);
				$('#uploadSuccess').html('上传完成');
				localStorage.insertId = eval(result).insertId;
				createImage(eval(result).stdout);

			}
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		}
	});
	// });
}

function uploadImage(url) {
	var imageData = {
		recorderId: localStorage.insertId,
		imgUrl: url,
		userId: localStorage.userAccount
	}
	console.log(imageData)
	$.post('http://' + ipAddress + '/uploadImage', imageData, function (data) {
	});
}
// function setProgress(event) {//进度条
// 	if (event.lengthComputable) {
// 	  var complete = Number.parseInt(event.loaded / event.total * 100);
// 	  progress.innerHTML = complete + '%';
// 	}
//   }
function createDownloadLink() {
	recorder && recorder.exportWAV(function (blob) {
		var url = URL.createObjectURL(blob);
		var div = document.createElement('div');
		var au = document.createElement('audio');
		var hf = document.createElement('a');
		upload_file(blob)
		downloadUrl = url;
		au.controls = true;
		au.src = url;
		hf.href = url;
		var date = new Date();
		hf.download = date + '.wav';
		hf.innerHTML = hf.download;
		downloadLink = hf.download;
		div.appendChild(au);
		div.appendChild(hf);
		$('#recordingslist').html('语音文件')
		recordingslist.appendChild(div);
	});
}
$.post('http://' + ipAddress + '/selectAllRecorder', {}, function (data) {
	var historyListLength;
	var list = eval(data);
	console.log(list)
	for (historyListLength = 0; historyListLength < list.length; historyListLength++) {
		$('.historyList ul').append('<li class="historyListItem"><div data-url="' + list[historyListLength].imageUrl + '">文件名:<a name="' + list[historyListLength].id + '" href="' + list[historyListLength].recorderFilePath + '" download="' + list[historyListLength].recorderFileName + '">语言文件' + list[historyListLength].recorderFileName + '</a><button class="btn btn-primary">详情</button><button class="btn btn-danger">删除</button></div></li>');
	}
})
$('.historyList ul').on('click', '.historyListItem div .btn-danger', function () {
	$('#removeMsak').removeClass('hideElement');
	removeFlag = $($(this).parent()).parent();
	$('#detailMsak').removeClass('hideElement');
	var name = $(this).parent().find('a')
});
$('#true').click(function () {
	$('#removeMsak').addClass('hideElement');
	removeFlag.remove();
});
$('#fales').click(function () {
	$('#removeMsak').addClass('hideElement');

});
$('.historyList ul').on('click', '.historyListItem div .btn-primary', function () {
	$('#detailMsak').removeClass('hideElement');
	var url = $(this).parent().find('a').attr('href');
	var name = $(this).parent().find('a').html();
	var imageUrl = $(this).parent().attr('data-url')
	$('.detailBox h4').html(name);
	$('.detailBox img').attr('src', imageUrl);
	$('.detailBox audio').attr('src', url);
});

function init(button) {
	button.disabled = true;
	try {
		// webkit shim
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		window.URL = window.URL || window.webkitURL;

		audio_context = new AudioContext;
		//		__log('Audio context set up.');
		//		__log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
	} catch (e) {
		alert('No web audio support in this browser!');
		jQuery('.startPrompt header').html('初始化失败')
		setTimeout($(this).remove(), 1000)

	}
	jQuery('.startPrompt header').html('初始化成功');
	setTimeout(function () {
		jQuery('.startPrompt header').html('')
	}, 1000)
	$('#startRecorder,#stopRecorder').attr('disabled', false);
	navigator.getUserMedia({
		audio: true
	}, startUserMedia, function (e) {
		//		__log('No live audio input: ' + e);
	});
};