# wx-audio
微信公众号音乐播放器

#### 基于原生js写的一款仿微信公众号的音乐组件

## 显示效果图
![](https://github.com/IFmiss/wx-audio/blob/master/images/audio.gif)

### 实例化 音乐组件 
<pre>
  var wxAudio = new Wxaudio({
     ele: '#textaudio1',
     title: '河山大好',
     disc: '许嵩',
     src: 'http://oiq8j9er1.bkt.clouddn.com/%E8%AE%B8%E5%B5%A9%20-%20%E6%B2%B3%E5%B1%B1%E5%A4%A7%E5%A5%BD1.mp3',
     width: '320px'
  });
</pre>

### 方法
<pre>
  // 实例化的wxAudio可以这样操作
  wxAudio.audioPlay()   // 播放
  
  wxAudio.audioPause()   // 暂停
  
  wxAudio.audioPlayPause()  // 播放暂停
  
  wxAudio.showLoading(bool)  //显示加载状态  参数bool
  
  wxAudio的audioCut(src,title,disc)  实现音频切换的效果
</pre>

### 新增 音乐组件切歌方法 
通过实例化的wxAudio的audioCut(src,title,disc)  实现音频切换的效果  示例代码如下
<pre>
  var src = 'http://oiq8j9er1.bkt.clouddn.com/%E6%9E%97%E4%BF%8A%E6%9D%B0%20-%20%E5%A5%B9%E8%AF%B41.mp3'
  var title = '她说'
  var disc = '林俊杰'
  wxAudio.audioCut(src, title, disc)
</pre>
