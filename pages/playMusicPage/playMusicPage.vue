<template>
  <view class="playMusicPage_warp" :style="'height: ' + windowHeight + 'px;'">

    <view class="header">
      <u-row style="width: 100%; height: 100%;">
        <u-col span="3" style="width: 100%; height: 100%;">
          <view class="header-left">

          </view>
        </u-col>
        <u-col span="6" style="width: 100%; height: 100%;">
          <view class="header-center">
            歌曲
          </view>
        </u-col>
        <u-col span="3" style="width: 100%; height: 100%;">
          <view class="header-right"></view>
        </u-col>
      </u-row>
    </view>

    <swiper class="swiper_warp"
            :style="'height: ' + windowHeight + 'px;'"
            :current="currentPageIndex"
            @change="changeCurrentPageIndex"
    >
      <swiper-item class="swiper-item_warp" :style="'height: ' + windowHeight + 'px;'">
        123123
      </swiper-item>
      <swiper-item class="swiper-item_warp" :style="'height: ' + windowHeight + 'px;'">

        <view class="content">



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
                {{currentMusic.currentTime | getMS}}
              </view>
              <view class="time-left">
                {{currentMusic.duration | getMS}}
              </view>
            </view>

            <view class="actions_warp">

              <view class="action-item">
                <u--image v-if="num === 0" src="../../static/icon/order.png" mode="widthFit" width="62rpx" height="47rpx" @tap="switchingOrderType"></u--image>
                <u--image v-if="num === 1" src="../../static/icon/repeat.png" mode="widthFit" width="62rpx" height="47rpx" @tap="switchingOrderType"></u--image>
                <u--image v-if="num === 2" src="../../static/icon/random-order.png" mode="widthFit" width="62rpx" height="47rpx" @tap="switchingOrderType"></u--image>
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
                <u-icon name="../../static/icon/forward-arrow.png" color="#ffffff" size="54rpx"></u-icon>
              </view>

              <view class="action-item">
                <u--image src="../../static/icon/music-list.png" mode="widthFit" width="56rpx" height="56rpx" @tap="switchingOrderType"></u--image>
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

  </view>
</template>

<script>
import {router, RouterMount} from "../../router";

export default {
  name: "playMusicPage",
  data() {
    return {
      num: 0,

      currentPageIndex: 1,  // 当前所在的滑块页
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
      },
    }
  },
  computed: {
  },
  filters: {
    getMS(time) {
      const min = parseInt(time % 3600 / 60) < 10 ? '0' + parseInt(time % 3600 / 60) : parseInt(time % 3600 / 60)
      const sec = parseInt(time % 3600 % 60) < 10 ? '0' + parseInt(time % 3600 % 60) : parseInt(time % 3600 % 60)
      return min + ':' + sec
    }
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

    this.offsetLineProgress = uni.upx2px(65)
    this.sliderWidth = uni.upx2px(20)

    this.createInnerAudioContext()

    // #ifdef APP-PLUS
    this.systemType = uni.getSystemInfoSync().platform
    if (this.systemType === 'android') {
      let Color = plus.android.importClass("android.graphics.Color")
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

    /**
    * 切换当前滑块页
    * */
    changeCurrentPageIndex() {
      console.log('changeCurrentPageIndex')
    },
  }
}
</script>

<style lang="scss" scoped>
.playMusicPage_warp {
  width: 100%;
  position: relative;

  .header {
    width: 100%;
    height: 80rpx;
    padding-top: var(--status-bar-height);
    z-index: 999;
    background-color: #FFFFFF;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    position: absolute;
    left: 0;
    top: 0;

    .header-left {
      width: 100%;
      height: 100%;
      background-color: #999999;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .header-center {
      width: 100%;
      height: 100%;
      background-color: #999999;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-right {
      width: 100%;
      height: 100%;
      background-color: #999999;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .swiper_warp {
    width: 100%;

    .swiper-item_warp {
      width: 100%;
      &:nth-child(1) {
        background-color: #9acafc;
      }
      &:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        background-color: #383b66;

        .content {
          flex: 1;
          width: 100%;
        }

        .bottom {
          width: 100%;

          .progress_warp {
            width: 100%;
            height: 40rpx;
            padding: 0 65rpx;
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
                background-color: rgba(255, 255, 255, 0.6);
                border-radius: 5rpx;
                position: relative;
                .line-progress {
                  height: 100%;
                  background-color: rgba(255, 255, 255, 0.8);
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
            padding: 0 65rpx;
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
            padding: 0 65rpx;
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
        background-color: rosybrown;
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