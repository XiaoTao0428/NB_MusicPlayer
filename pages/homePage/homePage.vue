<template>
  <view class="homePage_warp">
    <view class="to-playMusicPage">
      <u-button type="primary" text="听音乐" @tap="toPlayMusicPage"></u-button>
    </view>
  </view>
</template>

<script>
import {mapState} from "vuex"
export default {
  name: "homePage",
  data() {
    return {}
  },
  computed: {
    ...mapState(['window_android', 'android_graphics_Color'])
  },
  onShow() {
    // #ifdef APP-PLUS
    // this.window_android.setNavigationBarColor(this.android_graphics_Color.argb(255,255,255,255))
    // #endif
  },
  methods: {
    toPlayMusicPage() {
      this.$Router.push({
        name: 'playMusicPage'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.homePage_warp {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .to-playMusicPage {
    width: 300rpx;
    margin-top: 400rpx;
  }

}
</style>