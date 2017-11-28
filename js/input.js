function __log(e, data) {
	log.innerHTML += "\n" + e + " " + (data || '');
}

var audio_context;
var recorder;
function startUserMedia(stream) {
	var input = audio_context.createMediaStreamSource(stream);
	__log('Media stream created.');

	// Uncomment if you want the audio to feedback directly
	//input.connect(audio_context.destination);
	//__log('Input connected to audio context destination.');

	recorder = new Recorder(input);
	__log('Recorder initialised.');
}

function startRecording(button) {
	recorder && recorder.record();
	button.disabled = true;
	button.nextElementSibling.disabled = false;
	__log('Recording...');
}

function stopRecording(button) {
	recorder && recorder.stop();
	button.disabled = true;
	button.previousElementSibling.disabled = false;
	__log('Stopped recording.');

	// create WAV download link using audio data blob
	createDownloadLink();
	recorder.clear();
}
function upload_file(blob){//通过post上传文件
	var xhr = new XMLHttpRequest();
	var formData = new FormData();
	var date = new Date();
	console.log(blob);
	// recorder.exportWAV(function(blob) {
		var fd =new FormData();
		fd.append("customField",blob);
		console.log();		
		// fd.append("data",blob);
		fd.append("name",date.toISOString());
		$.ajax({
			url:"/upload",
			type:"POST",
			data:fd,
			cache:false,
			processData:false,   //  告诉jquery不要处理发送的数据
			contentType:false    // 告诉jquery不要设置content-Type请求头
		});
	// });
}
// function setProgress(event) {//进度条
// 	if (event.lengthComputable) {
// 	  var complete = Number.parseInt(event.loaded / event.total * 100);
// 	  progress.innerHTML = complete + '%';
// 	}
//   }
function createDownloadLink() {
	recorder && recorder.exportWAV(function(blob) {
		var url = URL.createObjectURL(blob);
		var li = document.createElement('li');
		var au = document.createElement('audio');
		var hf = document.createElement('a');
		var btn = document.createElement('button');
		btn.addEventListener('click',upload_file(blob),false);
		btn.innerHTML = "上传文件";
		btn.setAttribute('class','btn btn-primary')
		au.controls = true;
		au.src = url;
		hf.href = url;
		var date =  new Date();
		hf.download = date + '.wav';
		hf.innerHTML = hf.download;
		li.appendChild(au);
		li.appendChild(hf);
		li.appendChild(btn)
		recordingslist.appendChild(li);
	});
}

function init(button) {
	button.disabled = true;
	try {
		// webkit shim
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		window.URL = window.URL || window.webkitURL;

		audio_context = new AudioContext;
		__log('Audio context set up.');
		__log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
	} catch(e) {
		alert('No web audio support in this browser!');
	}
	
	navigator.getUserMedia({
		audio: true
	}, startUserMedia, function(e) {
		__log('No live audio input: ' + e);
	});
};
