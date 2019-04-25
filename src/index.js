import './style.less'
import WxAudio from './lib/wx-audio.js';

import axios from 'axios'
let index = 0
let wx, music

axios.get('http://www.daiwei.org/vue/server/music.php?inAjax=1&do=playlist&id=2179377798').then((res) => {
	music = res.data.playlist.tracks
  index = Math.floor(Math.random() * music.length)
	axios.get('http://www.daiwei.org/vue/server/music.php?inAjax=1&do=musicInfo&id=' + music[index].id).then((res) => {
		wx = new WxAudio ({
			ele: '.wx-audio',
			title: music[index].name,
			disc: music[index].ar[0].name,
			src: res.data.data[0].url,
			width: '320px',
			ended: function () {
				index = Math.floor(Math.random() * music.length)			
				axios.get('http://www.daiwei.org/vue/server/music.php?inAjax=1&do=musicInfo&id=' + music[index].id).then((res) => {
					console.log(music[index].ar[0].name)
					var src = res.data.data[0].url
					var title = music[index].name
					var disc = music[index].ar[0].name
					wx.audioCut(src, title, disc)
				}, (err) => {
					console.log(err)
				})
			}
		})
	})
}, (err) => {
	console.log(err)
})


document.getElementById('play').onclick = function () {
	wx.audioPlay()
}

document.getElementById('pause').onclick = function () {
	wx.audioPause()
}

document.getElementById('cut').onclick = function () {
	index = Math.floor(Math.random() * music.length)			
	axios.get('http://www.daiwei.org/vue/server/music.php?inAjax=1&do=musicInfo&id=' + music[index].id).then((res) => {
		console.log(music[index].ar[0].name)
		var src = res.data.data[0].url
		var title = music[index].name
		var disc = music[index].ar[0].name
		wx.audioCut(src, title, disc)
	}, (err) => {
		console.log(err)
	})
}
