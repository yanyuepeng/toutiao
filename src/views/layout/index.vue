<template>
  <div class="layout-container">
    <!--子路由出口-->
    <keep-alive>
      <router-view />
    </keep-alive>
    <!--/子路由出口-->

    <!--/底部导航栏-->
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/friends">动态</van-tabbar-item>
      <van-tabbar-item icon="manager-o" to="/my">我的</van-tabbar-item>
    </van-tabbar>
    <!--/底部导航栏-->
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  components: {},
  props: {},
  mounted () {
    this.$store.commit('addCachePage', 'LayoutIndex')
  },
  data () {
    return {
      active: 0
    }
  },
  computed: {},
  methods: {}
}
</script>

<style lang="less" scoped>

</style>
