<template>
  <view class="playMusicPage_warp" :style="'height: ' + windowHeight + 'px;'">

    <view class="video-mask" v-if="isVideoBg">
      <video class="video"
             :src="videoBgUrl"
             :autoplay="true"
             :loop="true"
             :muted="true"
             :controls="false"
             :show-fullscreen-btn="false"
             :show-play-btn="false"
             :show-center-play-btn="false"
             :enable-progress-gesture="false"
             object-fit="cover"
      ></video>
    </view>

    <view class="header">
      <u-row style="width: 100%; height: 100%;">
        <u-col span="3" style="width: 100%; height: 100%;">
          <view class="header-left">
            <u-icon name="arrow-left" size="44rpx"></u-icon>
          </view>
        </u-col>
        <u-col span="6" style="width: 100%; height: 100%;">
          <view class="header-center">
            <view :class="currentPageIndex === 0?'header-center-tab header-center-tab-checked':'header-center-tab'" @tap="currentPageIndex = 0">推荐</view>
            <view :class="currentPageIndex === 1?'header-center-tab header-center-tab-checked':'header-center-tab'" @tap="currentPageIndex = 1">歌曲</view>
            <view :class="currentPageIndex === 2?'header-center-tab header-center-tab-checked':'header-center-tab'" @tap="currentPageIndex = 2">歌词</view>
          </view>
        </u-col>
        <u-col span="3" style="width: 100%; height: 100%;">
          <view class="header-right">
<!--            <u-icon name="share-square" size="44rpx"></u-icon>-->
          </view>
        </u-col>
      </u-row>
    </view>

    <swiper class="swiper_warp"
            :style="isVideoBg?'height: ' + windowHeight + 'px;':'height: ' + windowHeight + 'px; background-color: ' + swiperWarpBg + ';'"
            :current="currentPageIndex"
            @change="changeCurrentPageIndex"
    >
      <swiper-item class="swiper-item_warp" :style="'height: ' + windowHeight + 'px;'">
        123123
      </swiper-item>
      <swiper-item class="swiper-item_warp" :style="'height: ' + windowHeight + 'px;'">

        <view class="content">

          <view class="poster-warp">
            <canvas class="poster-canvas" canvas-id="posterCanvasId" id="posterCanvasId"></canvas>
          </view>

          <view class="music-title">
            <view class="music-name">
              无归期
            </view>
            <view class="collect">
              <u-icon name="heart" size="70rpx"></u-icon>
            </view>
          </view>

          <view class="author">
            <view class="author-name">
              郑鱼
            </view>
          </view>

          <view class="lyrics">
            <view class="lyrics-text">
              悄悄 回忆的过去
            </view>
          </view>

        </view>


        <!--  #ifdef  H5 -->
        <view class="bottom" @touchmove.stop="">
          <!--  #endif -->

          <!--  #ifndef  H5 -->
          <view :class="systemType === 'ios'?'bottom ios-bottom':'bottom android-bottom'" @touchmove.stop="">
            <!--  #endif -->

            <view class="progress_warp">
              <view class="progress" @touchstart="progressBegin" @touchmove.stop.prevent="progressTouchmove" @touchend="touchmoveTouchend" @touchcancel="touchendTouchcancel">
                <view class="line-progress-warp">
                  <view class="line-progress" :style="'width: ' + percentage + 'px;'"></view>
                </view>
                <view class="circle-pointer" :style="'left: ' + circlePointerLeft + 'px;'"></view>
              </view>
            </view>

            <view class="time-warp">
              <view class="time-left">
                {{innerCurrentMusic.currentTime | getMS}}
              </view>
              <view class="time-left">
                {{innerCurrentMusic.duration | getMS}}
              </view>
            </view>

            <view class="actions_warp">

              <view class="action-item">
                <u--image v-if="musicListOrderType === 0" src="../../static/icon/order.png" mode="widthFit" width="62rpx" height="47rpx" @tap="switchingOrderType"></u--image>
                <u--image v-if="musicListOrderType === 1" src="../../static/icon/repeat.png" mode="widthFit" width="62rpx" height="47rpx" @tap="switchingOrderType"></u--image>
                <u--image v-if="musicListOrderType === 2" src="../../static/icon/random-order.png" mode="widthFit" width="62rpx" height="47rpx" @tap="switchingOrderType"></u--image>
              </view>

              <view class="action-item">
                <u-icon name="../../static/icon/back-arrow.png" size="54rpx"></u-icon>
              </view>

              <view class="action-item">
                <view class="play-or-pause" @tap="playOrPause" :style="isPlaying?'':'padding-left: 6rpx;'">
                  <u-icon v-if="!isPlaying" name="play-right-fill" color="#ffffff" size="64rpx"></u-icon>
                  <u-icon v-if="isPlaying" name="pause" color="#ffffff" size="64rpx"></u-icon>
                </view>
              </view>

              <view class="action-item">
                <u-icon name="../../static/icon/forward-arrow.png" color="#ffffff" size="54rpx" @tap="handleNextMusic"></u-icon>
              </view>

              <view class="action-item">
                <u--image src="../../static/icon/music-list.png" mode="widthFit" width="56rpx" height="56rpx" @tap="handleMusicListPopupShow"></u--image>
              </view>

            </view>

            <!--  #ifndef  H5 -->
          </view>
          <!--  #endif -->

          <!--  #ifdef  H5 -->
        </view>
        <!--  #endif -->

      </swiper-item>
      <swiper-item class="swiper-item_warp" :style="'height: ' + windowHeight + 'px;'">
        123123
      </swiper-item>
    </swiper>

    <u-popup :show="musicListPopupShow" :safeAreaInsetBottom="false" @close="musicListPopupClose">
      <view class="music-list-popup-content" :style="'height: ' + windowHeight * 0.8 + 'px;'">
        <text>出淤泥而不染，濯清涟而不妖</text>
        <text>出淤泥而不染，濯清涟而不妖</text>
        <text>出淤泥而不染，濯清涟而不妖</text>
        <text>出淤泥而不染，濯清涟而不妖</text>
        <text>出淤泥而不染，濯清涟而不妖</text>
      </view>
    </u-popup>

  </view>
</template>

<script>
import {mapState} from "vuex"
import {router, RouterMount} from "../../router";

export default {
  name: "playMusicPage",
  data() {
    return {
      musicListOrderType: 0,  // 音乐列表循环类型； 0是顺序，1是单曲循环，2是随机播放
      posterUrl: '',  // 音乐的海报
      isVideoBg: false,  // 是否是视频背景
      videoBgUrl: '',  // 视频背景地址
      Bg: '', //背景颜色
      currentPageIndex: 1,  // 当前所在的滑块页
      systemType: '',  // android 或 ios
      windowHeight: 0,  // 屏幕高度
      windowWidth: 0,  // 屏幕宽度
      statusBarHeight: 0,  // 状态栏高度

      sliderWidth: 0,  // 进度条圆点滑块宽度
      offsetLineProgress: 0,  // 进度条与左屏幕的距离

      lineProgressWidth: 0,  // 进度条总宽度
      isPlaying: false,  // 是否播放
      initPoint: {  // 触摸点位置信息
        identifier: 0,
        X: 0
      },

      touchMoving: false,  // 是否在移动进度条滑块中
      percentage: 0,  // 当前进度条的进度宽度
      circlePointerLeft: 0,  // 当前进度条上的圆点滑块的 left

      innerAudioContext: null,  // 音频上下文
      innerCurrentMusic: {  // 当前正则播放的音乐信息
        src: '',  // 音频的数据源
        startTime: 0,  // 开始播放的位置（单位：s），默认 0
        autoplay: false,  // 是否自动开始播放
        loop: false,  // 是否循环播放
        duration: '',  // 当前音频的长度（单位：s），只有在当前有合法的 src 时返回，需要在onCanplay中获取
        currentTime: '',  // 当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回，时间不取整，保留小数点后 6 位
        paused: '',  // 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
        buffered: '',  // 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲
        volume: '',  // 音量。范围 0~1
      },

      musicList: [],  // 音乐列表
      currMusicListIndex: 0,  // 当前播放的音乐的下标
      musicListPopupShow: false,  // 音乐列表弹窗是否显示

      oldRandomNum: [],  // 已经随机过了的随机数
    }
  },
  computed: {
    ...mapState(['window_android', 'android_graphics_Color']),
    swiperWarpBg() {
      let str = ''
      if (this.currentPageIndex === 1) {
        str = this.Bg
      }else {
        str = '#343233'
      }
      return str
    }
  },
  filters: {
    /**
    * 将 秒 转换为 分:秒
    * */
    getMS(time) {
      const min = parseInt(time % 3600 / 60) < 10 ? '0' + parseInt(time % 3600 / 60) : parseInt(time % 3600 / 60)
      const sec = parseInt(time % 3600 % 60) < 10 ? '0' + parseInt(time % 3600 % 60) : parseInt(time % 3600 % 60)
      return min + ':' + sec
    }
  },
  watch: {
    'innerCurrentMusic.currentTime': {
      handler: function () {
        if (!this.touchMoving && this.innerCurrentMusic.duration !== '' && this.innerCurrentMusic.currentTime !== '') {
          this.percentage = this.innerCurrentMusic.currentTime / this.innerCurrentMusic.duration * this.lineProgressWidth

          this.circlePointerLeft = this.percentage + this.offsetLineProgress - this.sliderWidth * 0.5
        }
      },
      immediate: true
    }
  },
  async onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.windowHeight = res.windowHeight
        this.windowWidth = res.windowWidth
        this.statusBarHeight = res.statusBarHeight
      }
    })

    this.offsetLineProgress = uni.upx2px(64)
    this.sliderWidth = uni.upx2px(20)

    await this.loadMusicListData()

    // #ifndef  APP-PLUS
    // this.createInnerAudioContextNoApp()
    // #endif
  },
  onReady() {
    const query = uni.createSelectorQuery().in(this)
    query.select('.line-progress-warp').boundingClientRect((res) => {
      this.lineProgressWidth = res.width
      this.circlePointerLeft = this.percentage + this.offsetLineProgress - this.sliderWidth * 0.5
    }).exec()

  },
  onUnload() {
    this.innerAudioContext.stop()
    this.innerAudioContext.destroy()

    // #ifdef MP
    this.innerAudioContext.offCanplay()
    this.innerAudioContext.offPlay()
    this.innerAudioContext.offPause()
    this.innerAudioContext.offStop()
    this.innerAudioContext.offEnded()
    this.innerAudioContext.offTimeUpdate()
    this.innerAudioContext.offError()
    this.innerAudioContext.offWaiting()
    this.innerAudioContext.offSeeking()
    this.innerAudioContext.offSeeked()
    // #endif
  },
  /**
  * 监听手机返回操作
  * */
  onBackPress() {
    // uni.navigateBack()
  },
  methods: {
    async loadMusicListData() {
      setTimeout(() => {
        this.musicList = [
          {
            src: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3',
            posterUrl: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3880341262,3308316348&fm=26&gp=0.jpg',
            videoBgUrl: '',
          },
          {
            src: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3',
            posterUrl: 'https://b2.kuibu.net/file/imgdisk/imgs/2021/12/0218fe16f7fa2058.jpg',
            videoBgUrl: '',
          },
          {
            src: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3',
            posterUrl: '',
            videoBgUrl: 'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4',
          }
        ]

        this.innerCurrentMusic.src = this.musicList[this.currMusicListIndex].src
        if (this.musicList[this.currMusicListIndex].posterUrl) {
          this.posterUrl = this.musicList[this.currMusicListIndex].posterUrl
          this.isVideoBg = false
        }else if (this.musicList[this.currMusicListIndex].videoBgUrl) {
          this.videoBgUrl = this.musicList[this.currMusicListIndex].videoBgUrl
          this.isVideoBg = true
        }

        if (!this.isVideoBg) {
          let posterCanvasWidth = this.windowWidth - this.offsetLineProgress * 2
          this.getImageColor("posterCanvasId", this.posterUrl, posterCanvasWidth).then(res => {
            if(res !== ''){
              this.Bg = 'rgba('+res.r+','+res.g+','+res.b+','+res.a+')'
              console.log('Bg', this.Bg)
              // #ifdef APP-PLUS
              // this.window_android.setNavigationBarColor(this.android_graphics_Color.argb(res.a,res.r,res.g,res.b))
              // #endif
            }
          })
        }

        this.createInnerAudioContextNoApp()
      }, 2000)
    },

    /**
    * 非 app端 创建并返回内部 audio 上下文
    * */
    createInnerAudioContextNoApp(state) {
      this.innerAudioContext = uni.createInnerAudioContext()

      this.innerAudioContext.src = this.innerCurrentMusic.src
      this.innerAudioContext.startTime = this.innerCurrentMusic.startTime
      this.innerAudioContext.autoplay = this.innerCurrentMusic.autoplay
      this.innerAudioContext.loop = this.innerCurrentMusic.loop

      this.innerAudioContext.onCanplay(() => {
        console.log('音频进入可以播放状态，但不保证后面可以流畅播放')
        this.innerCurrentMusic.duration = this.innerAudioContext.duration
        this.innerCurrentMusic.currentTime = this.innerAudioContext.currentTime
        this.innerCurrentMusic.paused = this.innerAudioContext.paused
        this.innerCurrentMusic.buffered = this.innerAudioContext.buffered
        this.innerCurrentMusic.volume = this.innerAudioContext.volume
        console.log('innerCurrentMusic', this.innerCurrentMusic)

        if (state) {
          this.innerAudioContext.play()
        }

      })
      this.innerAudioContext.onPlay(() => {
        console.log('开始播放')
        this.innerCurrentMusic.currentTime = this.innerAudioContext.currentTime
        this.innerCurrentMusic.paused = this.innerAudioContext.paused
        this.innerCurrentMusic.buffered = this.innerAudioContext.buffered
        this.innerCurrentMusic.volume = this.innerAudioContext.volume
        console.log('innerCurrentMusic', this.innerCurrentMusic)
        this.isPlaying = true
      })
      this.innerAudioContext.onPause(() => {
        console.log('播放暂停')
        this.innerCurrentMusic.currentTime = this.innerAudioContext.currentTime
        this.innerCurrentMusic.paused = this.innerAudioContext.paused
        this.innerCurrentMusic.buffered = this.innerAudioContext.buffered
        this.innerCurrentMusic.volume = this.innerAudioContext.volume
        console.log('innerCurrentMusic', this.innerCurrentMusic)
        this.isPlaying = false
      })
      this.innerAudioContext.onStop(() => {
        console.log('音频停止事件')
        this.innerCurrentMusic.currentTime = this.innerAudioContext.currentTime
        this.innerCurrentMusic.paused = this.innerAudioContext.paused
        this.innerCurrentMusic.buffered = this.innerAudioContext.buffered
        this.innerCurrentMusic.volume = this.innerAudioContext.volume
        console.log('innerCurrentMusic', this.innerCurrentMusic)
        this.isPlaying = false
      })
      this.innerAudioContext.onEnded(() => {
        console.log('音频自然播放结束事件')
        this.innerCurrentMusic.currentTime = this.innerAudioContext.currentTime
        this.innerCurrentMusic.paused = this.innerAudioContext.paused
        this.innerCurrentMusic.buffered = this.innerAudioContext.buffered
        this.innerCurrentMusic.volume = this.innerAudioContext.volume
        console.log('innerCurrentMusic', this.innerCurrentMusic)
        this.isPlaying = false
      })
      this.innerAudioContext.onTimeUpdate(() => {
        // console.log('音频播放进度更新事件')
        this.innerCurrentMusic.currentTime = this.innerAudioContext.currentTime
        this.innerCurrentMusic.paused = this.innerAudioContext.paused
        this.innerCurrentMusic.buffered = this.innerAudioContext.buffered
        this.innerCurrentMusic.volume = this.innerAudioContext.volume
        console.log('innerCurrentMusic', this.innerCurrentMusic)
      })
      this.innerAudioContext.onError(() => {
        console.log('音频播放错误')
        this.isPlaying = false
      })
      this.innerAudioContext.onWaiting(() => {
        console.log('音频加载中事件')
      })
      this.innerAudioContext.onSeeking(() => {
        console.log('音频进行 seek 操作事件')
      })
      this.innerAudioContext.onSeeked(() => {
        console.log('音频完成 seek 操作事件')
      })
    },
    /**
    * 播放或暂停
    * */
    playOrPause() {
      if (!this.isPlaying) {
        this.innerAudioContext.play()
      }else {
        this.innerAudioContext.pause()
      }
    },
    /**
    * 进度条拖动开始
    * */
    progressBegin(e) {
      // console.log('---------进度条拖动开始---------', e)
      if(e.touches.length > 1){
        return
      }

      this.touchMoving = true

      this.initPoint.identifier = e.touches[0].identifier
      this.initPoint.X = e.touches[0].clientX

      this.positionCirclePointer()
    },
    /**
     * 进度条拖动中
     * */
    progressTouchmove(e) {
      // console.log('---------进度条拖动中---------', e)
      e.touches.forEach((item, index) => {
        if (item.identifier === this.initPoint.identifier) {
          this.initPoint.X = item.clientX
        }
      })

      this.positionCirclePointer()
    },
    /**
     * 进度条拖动结束
     * */
    touchmoveTouchend(e) {
      // console.log('---------进度条拖动结束---------', e)

      let seekTime = this.percentage / this.lineProgressWidth * this.innerCurrentMusic.duration

      console.log(this.percentage, this.lineProgressWidth)

      this.innerAudioContext.seek(seekTime)

      if (!this.isPlaying) {
        this.innerAudioContext.play()
      }

      this.touchMoving = false
    },
    /**
     * 进度条拖动中断
     * */
    touchendTouchcancel(e) {
      // console.log('---------进度条拖动中断---------', e)

      this.touchMoving = false
    },
    /**
    * 定位进度条上圆点滑块的位置
    * */
    positionCirclePointer() {
      let num = 0
      if (this.initPoint.X <= this.offsetLineProgress) {
        num = this.offsetLineProgress - this.sliderWidth * 0.5
      } else if (this.initPoint.X >= this.windowWidth - this.offsetLineProgress) {
        num = this.windowWidth - this.offsetLineProgress - this.sliderWidth * 0.5
      }else {
        num = this.initPoint.X - this.sliderWidth * 0.5
      }
      this.circlePointerLeft = num

      this.calculatePercentage()
    },

    /**
    * 设置进度条的进度宽度
    * */
    calculatePercentage() {
      this.percentage = this.circlePointerLeft - this.offsetLineProgress + this.sliderWidth * 0.5
    },

    /**
    * 切换播放顺序类型
    * */
    switchingOrderType() {
      this.musicListOrderType++
      if (this.musicListOrderType >= 3) {
        this.musicListOrderType = 0
      }
    },

    /**
     * 点击音乐列表图标时触发
     * */
    handleMusicListPopupShow() {
      this.musicListPopupShow = !this.musicListPopupShow
    },

    /**
    * 点击下一首时触发
    * */
    handleNextMusic() {

      this.innerAudioContext.stop()
      this.innerAudioContext.destroy()

      if (this.oldRandomNum.length === this.musicList.length) {
        this.oldRandomNum = []
      }

      if (this.musicListOrderType === 0) {

        if (this.currMusicListIndex < this.musicList.length - 1) {
          this.currMusicListIndex++
        }else {
          this.currMusicListIndex = 0
        }

      } else if (this.musicListOrderType === 2) {
        this.currMusicListIndex = this.getNoCurrRandomNum(this.currMusicListIndex)
      }
      this.oldRandomNum.push(this.currMusicListIndex)
      console.log(this.currMusicListIndex)

      this.innerCurrentMusic.src = this.musicList[this.currMusicListIndex].src
      if (this.musicList[this.currMusicListIndex].posterUrl) {
        this.posterUrl = this.musicList[this.currMusicListIndex].posterUrl
        this.isVideoBg = false
      }else if (this.musicList[this.currMusicListIndex].videoBgUrl) {
        this.videoBgUrl = this.musicList[this.currMusicListIndex].videoBgUrl
        this.isVideoBg = true
      }

      this.createInnerAudioContextNoApp(true)

      // if (!this.isVideoBg) {
      //   let posterCanvasWidth = this.windowWidth - this.offsetLineProgress * 2
      //   this.getImageColor("posterCanvasId", this.posterUrl, posterCanvasWidth).then(res => {
      //     if(res !== ''){
      //       this.Bg = 'rgba('+res.r+','+res.g+','+res.b+','+res.a+')'
      //       console.log('Bg', this.Bg)
      //       // #ifdef APP-PLUS
      //       // this.window_android.setNavigationBarColor(this.android_graphics_Color.argb(res.a,res.r,res.g,res.b))
      //       // #endif
      //     }
      //   })
      // }

    },

    /*
    * 获取之前没有获取过的随机数
    * */
    getNoCurrRandomNum() {
      let num = Math.round(Math.random() * (this.musicList.length - 1))
      let state = false
      this.oldRandomNum.forEach((item, index) => {
        if (num === item) {
          state = true
        }
      })
      if (state) {
        num = this.getNoCurrRandomNum()
      }
      return num
    },

    /**
    * 音乐列表弹出层关闭时触发
    * */
    musicListPopupClose() {
      this.musicListPopupShow = false
    },

    /**
    * 切换当前滑块页
    * */
    changeCurrentPageIndex(e) {
      this.currentPageIndex = e.detail.current
    },

    /**
     * 求图片主题颜色
     * @param {String} canvasID 画布ID
     * @param {String} imgID 图片ID
     * @param {String} imgSrc 图片资源路径
     * */
    getImageColor(canvasID, imgSrc, posterCanvasWidth) {
      return new Promise((resolve, reject) => {

        console.log('1')

        let imgWidth,
            imgHeight
        let canvasWidth,
            canvasHeight
        let canvas = uni.createCanvasContext(canvasID, this)

        console.log('canvas', canvas)

        // 获取img的宽度/高度
        imgWidth = Math.round(posterCanvasWidth)
        imgHeight = Math.round(posterCanvasWidth)

        // 赋值canvas宽度/高度
        canvasWidth = imgWidth
        canvasHeight = imgHeight
        canvas.drawImage(imgSrc, 0, 0, canvasWidth + 2, canvasHeight + 2)
        canvas.draw(false, () => {

          console.log('2')

          // 获取像素数据
          uni.canvasGetImageData({
            // #ifdef MP-WEIXIN
            canvasId: canvas.canvasId,
            // #endif
            // #ifndef MP-WEIXIN
            canvasId: canvas.id,
            // #endif
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight,
            success: (res) => {

              console.log('3')

              let data = res.data

              let colorArray = [
                data[0],  // red 通道
                data[1],  // green 通道
                data[2],  // blue 通道
                data[3]  // alpha 通道
              ]

              // 开启透明度时，imageData 的每四个值代表一个点的 RGBA值
              for(let cnt = 4; undefined !== data[cnt + 3]; cnt += 1600){
                colorArray[0] = ((colorArray[0] + data[cnt]) >> 1)
                colorArray[1] = ((colorArray[1] + data[cnt + 1]) >> 1)
                colorArray[2] = ((colorArray[2] + data[cnt + 2]) >> 1)
                colorArray[3] = ((colorArray[3] + data[cnt + 3]) >> 1)
              }

              console.log('colorArray', colorArray)

              // 将最终的值取整
              colorArray[0] = Math.round(colorArray[0])
              colorArray[1] = Math.round(colorArray[1])
              colorArray[2] = Math.round(colorArray[2])
              colorArray[3] = Math.round(colorArray[3])
              let obj = {
                r: colorArray[0],
                g: colorArray[1],
                b: colorArray[2],
                a: colorArray[3]
              }

              resolve(obj)
            },
            fail: (fail) => {
              console.log('3-fail', fail)
              reject(fail)
            }
          }, this)
        })
      })

    },

  }
}
</script>

<style lang="scss" scoped>
.playMusicPage_warp {
  width: 100%;
  position: relative;

  .video-mask {
    width: 100%;
    height: 100%;
    background-color: #5ac725;
    position: absolute;
    z-index: -999;

    .video {
      width: 100%;
      height: 100%;
    }
  }

  .header {
    width: 100%;
    height: 150rpx;
    padding-top: var(--status-bar-height);
    padding-left: 40rpx;
    padding-right: 40rpx;
    box-sizing: border-box;
    z-index: 999;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    position: absolute;
    left: 0;
    top: 0;

    .header-left {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .header-center {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      color: rgba(255, 255, 255, 0.4);

      .header-center-tab {
        flex: 1;
        height: 14rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 1rpx solid rgba(255, 255, 255, 0.4);

        &:first-child {
          border-left: 0;
        }
        &:last-child {
          border-right: 0;
        }
      }

      .header-center-tab-checked {
        color: rgba(255, 255, 255, 0.9);
      }
    }
    .header-right {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .swiper_warp {
    width: 100%;
    -webkit-transition-property: background-color;
    -webkit-transition-duration: 0.3s;
    -webkit-transition-timing-function: ease;

    .swiper-item_warp {
      width: 100%;

      &:nth-child(1) {
      }
      &:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        .content {
          flex: 1;
          width: 100%;
          padding: 210rpx 64rpx 0 64rpx;
          box-sizing: border-box;

          .poster-warp {
            width: calc(100vw - 64rpx - 64rpx);
            height: calc(100vw - 64rpx - 64rpx);
            border-radius: 30rpx;
            overflow: hidden;
            border: 1rpx solid rgba(255, 255, 255, 0.4);

            .poster-canvas {
              width: calc(100vw - 64rpx - 64rpx);
              height: calc(100vw - 64rpx - 64rpx);
              border-radius: 30rpx;
            }
          }

          .music-title {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 70rpx;
            margin-bottom: 20rpx;
            color: rgba(255, 255, 255, 0.9);
            .music-name {
              font-size: 42rpx;
              font-weight: bold;
              white-space: nowrap;
            }
          }

          .author {
            width: 100%;
            font-size: 30rpx;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 30rpx;
          }

          .lyrics {
            width: 100%;
            font-size: 30rpx;
            color: rgba(255, 255, 255, 0.6);
          }
        }

        .bottom {
          width: 100%;

          .progress_warp {
            width: 100%;
            height: 40rpx;
            padding: 0 64rpx;
            box-sizing: border-box;
            position: relative;

            .progress {
              width: 100%;
              height: 28rpx;
              display: flex;
              align-items: center;
              justify-content: center;

              .line-progress-warp {
                width: 100%;
                height: 10rpx;
                background-color: rgba(255, 255, 255, 0.3);
                border-radius: 5rpx;
                position: relative;
                .line-progress {
                  height: 100%;
                  background-color: rgba(255, 255, 255, 0.9);
                  border-radius: 5rpx;
                  position: absolute;
                  left: 0;
                  top: 0;
                }
              }

              .circle-pointer {
                width: 20rpx;
                height: 20rpx;
                background-color: #FFFFFF;
                border-radius: 50%;
                position: absolute;
                top: 5rpx;
              }
            }
          }

          .time-warp {
            width: 100%;
            height: 20rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 30rpx;
            color: rgba(255, 255, 255, 0.6);
            padding: 0 64rpx;
            box-sizing: border-box;

            .time-left {

            }
            .time-left {

            }
          }

          .actions_warp {
            width: 100%;
            height: 200rpx;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 0 64rpx;
            box-sizing: border-box;

            .action-item {
              flex: 1;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;

              &:first-child {
                justify-content: flex-start;
              }

              &:nth-child(2) {
                justify-content: flex-start;
              }

              &:nth-child(4) {
                justify-content: flex-end;
              }

              &:last-child {
                justify-content: flex-end;
              }

              .play-or-pause {
                width: 120rpx;
                height: 120rpx;
                box-sizing: border-box;
                border: 4rpx solid #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
              }
            }
          }
        }

      }
      &:nth-child(3) {
      }
    }

  }


  .android-bottom {

  }

  .ios-bottom {
    margin-bottom: 40rpx;
  }

  .music-list-popup-content {
    width: 100%;
    height: 80%;
  }

}
</style>