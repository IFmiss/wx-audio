(function (window, document) {
	var Wxaudio = function (options) {
		if (!(this instanceof Wxaudio)) return new Wxaudio(options)
		this.value = {
			ele: '',
			width: '320px',
			title: '这是一个测试title',
			src: '',
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
				_this.isPlaying = true
				_this.showLoading(false)
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
							console.log('缓冲完成')
						} else {
							console.log('缓冲中...')
						}
					}
					var bufferedP = Math.floor((bufferedT / _this.durationT) * 100)
					_this.wxBufferP.style.width = bufferedP + '%'
				} else {
					console.log('未缓冲')
				}
			},
			// 绑定进度条
			_this.wxAudio.ontimeupdate = function () {
				if (!_this.isDrag) {
					// console.log(Math.floor())
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
				_this.isDrag = true
				var e = event || window.event
				var x = e.clientX
				var l = event.target.offsetLeft
				console.log(x)
				console.log(l)
				console.log(_this.maxProgressWidth)
				_this.maxProgressWidth = _this.wxAudioDetail.offsetWidth
				_this.wxAudioC.onmousemove = function (event) {
					if (_this.isDrag) {
						var e = event || window.event
						var thisX = e.clientX
						_this.dragProgressTo = Math.min(_this.maxProgressWidth, Math.max(0, l + (thisX - x)))
						// _this.wxAudioOrigin.style.left = to + 'px'
						console.log(e.clientX + '--------')
						console.log(_this.maxProgressWidth + '--------')
						console.log(l + (thisX - x) + '--------')
						// update Time
						_this.updatePorgress(_this)
					}
				}
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

			_this.wxAudioOrigin.ontouchstart = function (event) {
				_this.isDrag = true
				var e = event || window.event
				var x = e.touches[0].clientX
				var l = e.target.offsetLeft

				_this.maxProgressWidth = _this.wxAudioDetail.offsetWidth

				_this.wxAudioC.ontouchmove = function (event) {
					if (_this.isDrag) {
						var e = event || window.event
						var thisX = e.touches[0].clientX
						_this.dragProgressTo = Math.min(_this.maxProgressWidth, Math.max(0, l + (thisX - x)))
						_this.updatePorgress(_this)
					}
				},
				_this.wxAudioC.ontouchend = function () {
					// console.log(_this.dragProgressTo +' ------- '+ _this.maxProgressWidth + ' ---------- ' + _this.durationT)
					if (_this.isDrag) {
						_this.isDrag = false
						_this.wxAudio.currentTime = Math.floor(_this.dragProgressTo / _this.maxProgressWidth * _this.durationT)
					} else {
						return
					}
				}
			}

			_this.wxAudioDetail.onclick = function (event) {
				var e = event || window.event
				var l = e.layerX
				var w = _this.wxAudioDetail.offsetWidth
				console.log(l + '------------' + w)
				_this.wxAudio.currentTime = Math.floor(l / w * _this.durationT)
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