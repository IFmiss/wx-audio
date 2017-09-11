# wx-audio
微信公众号音乐播放器

#### 基于原生js写的一款仿微信公众号的音乐组件

## 显示效果图
![](https://github.com/IFmiss/wx-audio/blob/master/images/audio.gif)

<pre>
  var wxAudio = new Wxaudio({
		ele: '#textaudio1',
		title: '河山大好',
		disc: '许嵩',
		src: 'http://oiq8j9er1.bkt.clouddn.com/%E8%AE%B8%E5%B5%A9%20-%20%E6%B2%B3%E5%B1%B1%E5%A4%A7%E5%A5%BD1.mp3',
		width: '320px'
	});
  
  // 实例化的wxAudio可以这样操作
  wxAudio.audioPlay()   // 播放
  wxAudio.audioPause()   // 暂停
  wxAudio.audioPlayPause()  // 播放暂停
  wxAudio.showLoading()  //显示加载状态
</pre>
