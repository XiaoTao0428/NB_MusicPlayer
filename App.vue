<script>
  import {mapMutations} from "vuex"

	export default {
    data() {
      return {

      }
    },
    methods: {
      ...mapMutations(['setWindow_android', 'setAndroid_graphics_Color'])
    },
		onLaunch: function() {
			console.log('App Launch')

      console.log('token', this.$store.state.token)

      // #ifdef APP-PLUS

      // let systemType = uni.getSystemInfoSync().platform
      // if (systemType === 'android') {
      //   let Color = plus.android.importClass("android.graphics.Color")
      //   this.setAndroid_graphics_Color(Color)
      //   plus.android.importClass("android.view.Window")
      //   let mainActivity = plus.android.runtimeMainActivity()
      //   let window_android = mainActivity.getWindow()
      //   this.setWindow_android(window_android)
      //   // window_android.setNavigationBarColor(Color.argb(32,32,32,32))
      // }

      // #endif

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
  @import "@/uni_modules/uview-ui/index.scss";
</style>
