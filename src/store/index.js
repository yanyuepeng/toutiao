import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY),
    // user: JSON.parse(window.localStorage.getItem('user')) // 当前登录用户的状态（token等数据）

    cachePages: ['LayoutIndex']
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      setItem(USER_KEY, state.user)
      // state.user = data
      // window.localStorage.setItem('user', JSON.stringify(state.user))
    },

    // 添加缓存页面
    addCachePage (state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },
    // 移除缓存页面
    removeCachePage (state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
