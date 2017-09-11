(function (window, document) {
	var Wxaudio = function (options) {
		if (!(this instanceof Wxaudio)) return new Wxaudio(options)
		this.value = {
			ele: '',
			width: '400px',
			title: '这是一个测试title',
			src: 'http://oiq8j9er1.bkt.clouddn.com/%E8%AE%B8%E5%B5%A9%20-%20%E6%B2%B3%E5%B1%B1%E5%A4%A7%E5%A5%BD1.mp3',
			disc: '这是一个测试disc',
			loop: true,
			autoplay: false
		}

		this.opt = this.extend(this.value, options, true)

		// 判断传进来的是DOM还是字符串
        if ((typeof options.ele) === "string") {
            this.opt.ele = document.querySelector(options.ele)
        }else{  
            this.opt.ele = options.ele
        }

        this.loading = false
        this.isDrag = false
		this.isplaying = false
		this.durationT = 0
		this.currentT = 0
		this.currentP = 0
		this.maxProgressWidth = 0
		this.dragProgressTo = 0

		// 通过时间戳与当前时间的差值来判断是否需要加载
		this.reduceTBefore = 0   // 时间戳与当前时间的差值 (初始化)
		this.reduceTAfter = 0   // 时间戳与当前时间的差值 (执行中)

        this.initDom();
	}

	Wxaudio.prototype = {
		constructor: this,
		initDom: function () {
			// content
			this.wxAudioC = document.createElement('div')
			this.wxAudioC.className = 'wx-audio-content'
			this.wxAudioC.style.width = this.opt.width
			this.opt.ele.appendChild(this.wxAudioC)

			// audio 
			this.wxAudio = document.createElement('audio')
			this.wxAudio.className = 'wx-audio-content'
			this.wxAudio.src = this.opt.src
			this.wxAudioC.appendChild(this.wxAudio)

			// left
			this.wxAudioL = document.createElement('div')
			this.wxAudioL.className = 'wx-audio-left'
			this.wxAudioC.appendChild(this.wxAudioL)

			// left image
			this.wxAudioStateImg = document.createElement('img')
			this.wxAudioStateImg.className = 'wx-audio-state'
			this.wxAudioStateImg.src = '../images/pause.png'
			this.wxAudioL.appendChild(this.wxAudioStateImg)

			// right
			this.wxAudioR = document.createElement('div')
			this.wxAudioR.className = 'wx-audio-right'
			this.wxAudioC.appendChild(this.wxAudioR)

			// right  title
			this.wxAudioT = document.createElement('p')
			this.wxAudioT.className = 'wx-audio-title'
			this.wxAudioT.innerText = this.opt.title
			this.wxAudioR.appendChild(this.wxAudioT)

			// right  disc
			this.wxAudioD = document.createElement('p')
			this.wxAudioD.className = 'wx-audio-disc'
			this.wxAudioD.innerText = this.opt.disc
			this.wxAudioR.appendChild(this.wxAudioD)

			// right  progrees
			this.wxAudioP = document.createElement('div')
			this.wxAudioP.className = 'wx-audio-progrees'
			this.wxAudioR.appendChild(this.wxAudioP)

			// right progress detail 
			this.wxAudioDetail = document.createElement('div')
			this.wxAudioDetail.className = 'wx-progrees-detail'
			this.wxAudioP.appendChild(this.wxAudioDetail)

			// voice p
			this.wxVoiceP = document.createElement('span')
			this.wxVoiceP.className = 'wx-voice-p'
			this.wxAudioDetail.appendChild(this.wxVoiceP)

			// buffer p
			this.wxBufferP = document.createElement('span')
			this.wxBufferP.className = 'wx-buffer-p'
			this.wxAudioDetail.appendChild(this.wxBufferP)

			// loading p
			this.wxLoading = document.createElement('span')
			this.wxLoading.className = 'wx-loading'
			this.wxAudioDetail.appendChild(this.wxLoading)

			// laoding wrapper
			this.wxLoadingWrapper = document.createElement('span')
			this.wxLoadingWrapper.className = 'wx-loading-wrapper'
			this.wxLoading.appendChild(this.wxLoadingWrapper)

			// origin 
			this.wxAudioOrigin = document.createElement('div')
			this.wxAudioOrigin.className = 'wx-audio-origin'
			this.wxAudioP.appendChild(this.wxAudioOrigin)

			// 音乐时间信息
			this.wxAudioTime = document.createElement('div')
			this.wxAudioTime.className = 'wx-audio-time'
			this.wxAudioR.appendChild(this.wxAudioTime)

			// currentT
			this.wxAudioCurrent = document.createElement('span')
			this.wxAudioCurrent.className = 'current-t'
			this.wxAudioCurrent.innerText = '00:00'
			this.wxAudioTime.appendChild(this.wxAudioCurrent)

			// durationT
			this.wxAudioDuration = document.createElement('span')
			this.wxAudioDuration.className = 'duration-t'
			this.wxAudioDuration.innerText = '00:00'
			this.wxAudioTime.appendChild(this.wxAudioDuration)

			this.initAudioEvent();
		},

		audioPlay: function () {
			this.wxAudio.play();
			this.isPlaying = true
		},

		audioPause: function () {
			this.wxAudio.pause();
			this.isPlaying = false
		},

		audioPlayPause: function () {
			if (this.isPlaying) {
				this.audioPause();
			} else {
				this.audioPlay();
			}
		},

		showLoading: function (bool) {
			this.loading = bool || false
			if (this.loading) {
				this.wxLoading.style.display = 'block'
			} else {
				this.wxLoading.style.display = 'none'
			}
		},

		initAudioEvent: function () {
			var _this = this
			// 音频事件
			_this.wxAudio.onplaying = function () {
				var date = new Date ()
				_this.isPlaying = true
				_this.showLoading(false)
				_this.reduceTBefore = Date.parse(date) - Math.floor(_this.wxAudio.currentTime * 1000)
				_this.wxAudioStateImg.src = '../images/playing.gif'
			},
			_this.wxAudio.onpause = function () {
				_this.isPlaying = false
				_this.wxAudioStateImg.src = '../images/pause.png'
			},
			_this.wxAudio.onloadedmetadata = function () {
				_this.durationT = _this.wxAudio.duration
				// 初始化视频时间
				_this.wxAudioDuration.innerText = _this.formartTime(_this.durationT)
			},
			_this.wxAudio.onwaiting = function () {
				_this.showLoading(true)
			},
			_this.wxAudio.onprogress = function () {
				if(_this.wxAudio.buffered.length > 0) {
					var bufferedT = 0
					for (var i = 0; i < _this.wxAudio.buffered.length; i++) {
						bufferedT += _this.wxAudio.buffered.end(i) - _this.wxAudio.buffered.start(i)
						if(bufferedT > _this.durationT) {
							bufferedT = _this.durationT
							_this.wxLoading.style.display = 'none'
						} else {
							_this.wxLoading.style.display = 'block'
						}
					}
					var bufferedP = Math.floor((bufferedT / _this.durationT) * 100)
					_this.wxBufferP.style.width = bufferedP + '%'
				}
				// ===========================
				var date = new Date ()
				console.log(_this.wxAudio.paused)
				if(!_this.wxAudio.paused) {
					_this.reduceTAfter = Date.parse(date) - Math.floor(_this.currentT * 1000)
					if(_this.reduceTAfter - _this.reduceTBefore > 1000) {
						_this.wxLoading.style.display = 'block'
					} else {
						_this.wxLoading.style.display = 'none'
					}
				} else {
					return
				}
			},
			// 绑定进度条
			_this.wxAudio.ontimeupdate = function () {
				var date = new Date ()
				if (!_this.isDrag) {
					_this.currentT = _this.wxAudio.currentTime
					_this.reduceTBefore = Date.parse(date) - Math.floor(_this.currentT * 1000)
					_this.currentP = Number((_this.wxAudio.currentTime / _this.durationT) * 100)
					_this.currentP = _this.currentP > 100 ? 100 : _this.currentP
					_this.wxVoiceP.style.width = _this.currentP + '%'
					_this.wxAudioOrigin.style.left = _this.currentP + '%'
					// 更改时间进度
					_this.wxAudioCurrent.innerText = _this.formartTime(_this.wxAudio.currentTime)
				}
			},
			// 页面点击事件
			_this.wxAudioStateImg.onclick = function () {
				_this.audioPlayPause()
			}

			_this.wxAudioOrigin.onmousedown = function (event) {
				// _this.mouseDown(e, _this);
				// drag
				_this.isDrag = true
				let e = event || window.event
				let x = e.clientX
				var l = event.target.offsetLeft
				console.log(event.target.offsetLeft)
				console.log(event.target.offsetWidth / 2)
				console.log(_this.maxProgressWidth)
				_this.maxProgressWidth = _this.wxAudioDetail.offsetWidth - (event.target.offsetWidth / 2)
				_this.wxAudioC.onmousemove = function (event) {
					if (_this.isDrag) {
						let e = event || window.event
						let thisX = e.clientX
						_this.dragProgressTo = Math.min(_this.maxProgressWidth, Math.max(0, l + (thisX - x)))
						// _this.wxAudioOrigin.style.left = to + 'px'
						// console.log(to + '--------' + max)
						// update Time
						_this.updatePorgress(_this)
					}

					// _this.ondrag(Math.round(Math.max(0, to / max) * 100), to)
					// window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
				}
				// _this.wxAudioC.onmouseup = new Function('this.onmouseup = null')
				// _this.wxAudioC.onmouseleave = new Function('this.onmouseup = null')
				// _this.wxAudioC.onmouseup = new Function('this.onmousemove=null');
				// _this.wxAudioC.onmouseleave = new Function('this.onmousemove = null')
				_this.wxAudioC.onmouseup = function () {
					console.log(_this.dragProgressTo +' ------- '+ _this.maxProgressWidth + ' ---------- ' + _this.durationT)
					if (_this.isDrag) {
						_this.isDrag = false
						_this.wxAudio.currentTime = Math.floor(_this.dragProgressTo / _this.maxProgressWidth * _this.durationT)
					} else {
						return
					}
				}

				_this.wxAudioC.onmouseleave = function () {
					if (_this.isDrag) {
						_this.isDrag = false
						_this.wxAudio.currentTime = Math.floor(_this.dragProgressTo / _this.maxProgressWidth * _this.durationT)
					} else {
						return
					}
				}
			}

			_this.wxAudioDetail.onclick = function (event) {
				let e = event || window.event
				console.log(e.target.offsetLeft + '--------------' + e.target.offsetWidth)
			}

			// _this.wxAudioOrigin.ontachstart = function () {

			// }
		},

		updatePorgress: function (that) {
			that.wxAudioOrigin.style.left = that.dragProgressTo + 'px'
			that.wxVoiceP.style.width = that.dragProgressTo + 'px'
			var currentTime = Math.floor(that.dragProgressTo / that.maxProgressWidth * that.durationT)
			// that.wxAudio.currentTime = currentTime
			that.wxAudioCurrent.innerText = that.formartTime(currentTime)
			// that.wxAudio.currentTime = Math.floor(that.dragProgressTo / that.maxProgressWidth * that.durationT)
		},

		formartTime: function (seconds) {
			var formatNumber = function (n) {
	            n = n.toString()
	            return n[1] ? n : '0' + n
	        }
	        var m = Math.floor(seconds / 60);
	        var s = Math.floor(seconds % 60);
	        return formatNumber(m) + ":" + formatNumber(s);
		},

		extend: function(o,n,override) {
		    for(var key in n){
		        if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
		            o[key] = n[key]
		        }
		    }
		    return o
		}
	}

	// 暴露方法  
    window.Wxaudio = Wxaudio;
})(window, document)