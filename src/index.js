import './style.scss'
import WxAudio from './lib/wx-audio.js';
import {utils} from 'commonjs/utils.js';

const wx = new WxAudio ({
	ele: '.wx-audio',
	title: '河山大好',
	disc: '许嵩',
	src: 'http://oiq8j9er1.bkt.clouddn.com/%E8%AE%B8%E5%B5%A9%20-%20%E6%B2%B3%E5%B1%B1%E5%A4%A7%E5%A5%BD1.mp3',
	width: '320px',
	ended: function () {
		var src = 'http://oiq8j9er1.bkt.clouddn.com/%E6%9E%97%E4%BF%8A%E6%9D%B0%20-%20%E5%A5%B9%E8%AF%B41.mp3'
		var title = '她说'
		var disc = '林俊杰'
		wx.audioCut(src, title, disc)
	}
})

document.getElementById('play').onclick = function () {
	wx.audioPlay()
}

document.getElementById('pause').onclick = function () {
	wx.audioPause()
}

document.getElementById('cut').onclick = function () {
	var src = 'http://oiq8j9er1.bkt.clouddn.com/%E6%9E%97%E4%BF%8A%E6%9D%B0%20-%20%E5%A5%B9%E8%AF%B41.mp3'
  var title = '她说'
  var disc = '林俊杰'
  wx.audioCut(src, title, disc)
}
