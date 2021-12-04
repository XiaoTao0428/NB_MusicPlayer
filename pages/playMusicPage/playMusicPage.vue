<template>
  <view class="playMusicPage_warp" :style="'height: ' + windowHeight + 'px;'">

    <view class="content">

    </view>

    <view :class="systemType === 'ios'?'bottom ios-bottom':'bottom android-bottom'">

      <view class="progress_warp">
        <view class="progress" @touchstart="progressBegin" @touchmove.stop.prevent="progressTouchmove" @touchend="touchmoveTouchend" @touchcancel="touchendTouchcancel">
<!--          <u-line-progress :percentage="percentage" height="40rpx"></u-line-progress>-->
          <view class="line-progress-warp">
            <view class="line-progress" :style="'width: ' + percentage + 'px;'"></view>
          </view>
          <view class="circle-pointer" :style="'left: ' + circlePointerLeft + 'px;'"></view>
        </view>
      </view>

      <view class="time-warp">
        {{currentMusic.currentTime}} - {{currentMusic.duration}}
      </view>

      <view class="actions_warp">

        <view class="action-item">
          <u--image v-if="num === 0" src="../../static/icon/order.png" mode="widthFit" width="65.5rpx" height="50rpx" @tap="switchingOrderType"></u--image>
          <u--image v-if="num === 1" src="../../static/icon/repeat.png" mode="widthFit" width="65.5rpx" height="50rpx" @tap="switchingOrderType"></u--image>
          <u--image v-if="num === 2" src="../../static/icon/random-order.png" mode="widthFit" width="65.5rpx" height="50rpx" @tap="switchingOrderType"></u--image>
<!--          <u-icon name="../../static/icon/repeat.png" size="54rpx"></u-icon>-->
        </view>

        <view class="action-item">
          <u-icon name="../../static/icon/back-arrow.png" size="54rpx"></u-icon>
        </view>

        <view class="action-item">
          <view class="playOrPause" @tap="playOrPause" :style="isPlaying?'':'padding-left: 6rpx;'">
            <u-icon v-if="!isPlaying" name="play-right-fill" color="#ffffff" size="64rpx"></u-icon>
            <u-icon v-if="isPlaying" name="pause" color="#ffffff" size="64rpx"></u-icon>
          </view>
        </view>

        <view class="action-item">
          <u-icon name="../../static/icon/forward-arrow.png" color="#ffffff" size="54rpx"></u-icon>
        </view>

        <view class="action-item">

        </view>

      </view>
    </view>

  </view>
</template>

<script>
import {router, RouterMount} from "../../router";

export default {
  name: "playMusicPage",
  data() {
    return {
      num: 0,

      systemType: '',  // android 或 ios
      innerAudioContext: null,  // 音频上下文
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

      currentMusic: {  // 当前正则播放的音乐信息
        src: 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3',
        startTime: 0,  // 开始播放的位置（单位：s），默认 0
        autoplay: false,  // 是否自动开始播放
        loop: false,  // 是否循环播放
        duration: '',  // 当前音频的长度（单位：s），只有在当前有合法的 src 时返回，需要在onCanplay中获取
        currentTime: '',  // 当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回，时间不取整，保留小数点后 6 位
        paused: '',  // 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
        buffered: '',  // 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲
        volume: '',  // 音量。范围 0~1
      }
    }
  },
  computed: {
  },
  watch: {
    'currentMusic.currentTime': {
      handler: function () {
        if (!this.touchMoving && this.currentMusic.duration !== '' && this.currentMusic.currentTime !== '') {
          this.percentage = this.currentMusic.currentTime / this.currentMusic.duration * this.lineProgressWidth

          this.circlePointerLeft = this.percentage + this.offsetLineProgress - this.sliderWidth * 0.5
        }
      },
      immediate: true
    }
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.windowHeight = res.windowHeight
        this.windowWidth = res.windowWidth
        this.statusBarHeight = res.statusBarHeight
      }
    })

    this.offsetLineProgress = uni.upx2px(40)
    this.sliderWidth = uni.upx2px(40)

    this.createInnerAudioContext()

    // #ifdef APP-PLUS
    this.systemType = uni.getSystemInfoSync().platform
    if (this.systemType === 'android') {
      let Color = plus.android.importClass("android.graphics.Color")

      console.log(Color)

      plus.android.importClass("android.view.Window")
      let mainActivity = plus.android.runtimeMainActivity()
      let window_android = mainActivity.getWindow()
      window_android.setNavigationBarColor(Color.argb(32,32,32,32))
    }
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
    // #ifdef MP
    this.innerAudioContext.offPlay()
    this.innerAudioContext.offPause()
    this.innerAudioContext.offError()
    // this.innerAudioContext.offTimeUpdate()
    // #endif
    this.innerAudioContext.stop()
    this.innerAudioContext.destroy()
  },
  methods: {
    /**
    * 创建并返回内部 audio 上下文
    * */
    createInnerAudioContext() {
      this.innerAudioContext = uni.createInnerAudioContext()

      this.innerAudioContext.src = this.currentMusic.src
      this.innerAudioContext.startTime = this.currentMusic.startTime
      this.innerAudioContext.autoplay = this.currentMusic.autoplay
      this.innerAudioContext.loop = this.currentMusic.loop

      this.innerAudioContext.onCanplay(() => {
        console.log('音频进入可以播放状态，但不保证后面可以流畅播放')
        this.currentMusic.duration = this.innerAudioContext.duration
        this.currentMusic.currentTime = this.innerAudioContext.currentTime
        this.currentMusic.paused = this.innerAudioContext.paused
        this.currentMusic.buffered = this.innerAudioContext.buffered
        this.currentMusic.volume = this.innerAudioContext.volume
        console.log('currentMusic', this.currentMusic)
      })
      this.innerAudioContext.onPlay(() => {
        console.log('开始播放')
        this.currentMusic.currentTime = this.innerAudioContext.currentTime
        this.currentMusic.paused = this.innerAudioContext.paused
        this.currentMusic.buffered = this.innerAudioContext.buffered
        this.currentMusic.volume = this.innerAudioContext.volume
        console.log('currentMusic', this.currentMusic)
        this.isPlaying = true
      })
      this.innerAudioContext.onPause(() => {
        console.log('播放暂停')
        this.currentMusic.currentTime = this.innerAudioContext.currentTime
        this.currentMusic.paused = this.innerAudioContext.paused
        this.currentMusic.buffered = this.innerAudioContext.buffered
        this.currentMusic.volume = this.innerAudioContext.volume
        console.log('currentMusic', this.currentMusic)
        this.isPlaying = false
      })
      this.innerAudioContext.onStop(() => {
        console.log('音频停止事件')
        this.currentMusic.currentTime = this.innerAudioContext.currentTime
        this.currentMusic.paused = this.innerAudioContext.paused
        this.currentMusic.buffered = this.innerAudioContext.buffered
        this.currentMusic.volume = this.innerAudioContext.volume
        console.log('currentMusic', this.currentMusic)
        this.isPlaying = false
      })
      this.innerAudioContext.onEnded(() => {
        console.log('音频自然播放结束事件')
        this.currentMusic.currentTime = this.innerAudioContext.currentTime
        this.currentMusic.paused = this.innerAudioContext.paused
        this.currentMusic.buffered = this.innerAudioContext.buffered
        this.currentMusic.volume = this.innerAudioContext.volume
        console.log('currentMusic', this.currentMusic)
        this.isPlaying = false
      })
      this.innerAudioContext.onTimeUpdate(() => {
        // console.log('音频播放进度更新事件')
        this.currentMusic.currentTime = this.innerAudioContext.currentTime
        this.currentMusic.paused = this.innerAudioContext.paused
        this.currentMusic.buffered = this.innerAudioContext.buffered
        this.currentMusic.volume = this.innerAudioContext.volume
        console.log('currentMusic', this.currentMusic)
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

      let seekTime = this.percentage / this.lineProgressWidth * this.currentMusic.duration

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
      this.num++
      if (this.num >= 3) {
        this.num = 0
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.playMusicPage_warp {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .content {
    flex: 1;
    width: 100%;
  }

  .bottom {
    width: 100%;
    height: 300rpx;
    background-color: #3F536E;

    .progress_warp {
      width: 100%;
      height: 60rpx;
      background-color: #999999;
      padding: 0 40rpx;
      box-sizing: border-box;
      position: relative;

      .progress {
        width: 100%;
        height: 40rpx;
        background-color: lightsalmon;

        .line-progress-warp {
          width: 100%;
          height: 40rpx;
          background-color: lightsalmon;
          position: relative;
          .line-progress {
            height: 100%;
            background-color: teal;
            position: absolute;
            left: 0;
            top: 0;
          }
        }

        .circle-pointer {
          width: 40rpx;
          height: 20rpx;
          background-color: #007aff;
          position: absolute;
          top: 0;
        }
      }
    }

    .actions_warp {
      width: 100%;
      height: 200rpx;
      background-color: #9acafc;
      display: flex;
      align-items: center;
      justify-content: center;

      .action-item {
        flex: 1;
        height: 100%;
        background-color: #4cd964;
        margin: 0 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .playOrPause {
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

  .android-bottom {

  }

  .ios-bottom {
    margin-bottom: 40rpx;
  }

}
</style>