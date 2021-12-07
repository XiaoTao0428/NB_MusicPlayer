import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        window_android: null,
        android_graphics_Color: null,
        login: false,
        token: '',
        avatarUrl: '',
        userName: ''
    },
    mutations: {
        login(state, provider) {
            state.login = true
            state.token = provider.token
            state.userName = provider.userName
            state.avatarUrl = provider.avatarUrl
        },
        logout(state) {
            state.login = false
            state.token = ''
            state.userName = ''
            state.avatarUrl = ''
        },
        setWindow_android(state, window_android) {
            state.window_android = window_android
        },
        setAndroid_graphics_Color(state, android_graphics_Color) {
            state.android_graphics_Color = android_graphics_Color
        }
    }
})
export default store