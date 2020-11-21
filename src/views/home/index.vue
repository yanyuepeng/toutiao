<template>
  <div class="home-container">
    <!--导航栏-->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        class="search-btn"
        icon="search"
        type="info"
        round
        size="small"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!--导航栏-->

    <!-- 文章频道列表 -->
    <!-- 导入接口 -->
    <van-tabs v-model="active" class="channel-tabs">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <article-list :channel="channel" />
      </van-tab>

      <div slot="nav-right" class="wap-nav-placeholder"></div>

      <div slot="nav-right" class="wap-nav-warp" @click="isChannelEditShow = true">
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- /文章频道列表 -->

    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      get-container="body"
      style="height: 100%"
    >
      <channel-edit
        :user-channels="channels"
        :active="active"
        @close="isChannelEditShow = false"
        @update-active="active = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  created () {
    this.loadChannels()
  },
  data () {
    return {
      channels: [],
      active: 0, // 控制被激活的标签
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async loadChannels () {
      let channels = []
      if (this.user) {
        // 已经登录，线上获取
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 没有登录，本地获取
        const localChannels = getItem('user-channels')
        // 本地有 用本地列表
        if (localChannels) {
          channels = localChannels
        } else {
          // 本地无 获取默认推荐列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      this.channels = channels
    }

    // onUpdateActive (index) {
    //   this.active = index
    // }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }

  .channel-tabs {
    /deep/ .van-tabs__nav {
      display: flex;
    }
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tab{
      flex-basis: 24%;
    }
    /deep/ .van-tabs__line {
      bottom: 20px;
      width: 25px !important;
      height: 3px;
      background: #3296fa;
    }
    /deep/ .van-tab__text {
      margin: auto;
    }
  }

  /deep/ .wap-nav-placeholder{
    width: 33px;
    flex-shrink: 0;
  }

  .wap-nav-warp {
    position: fixed;
    right: 0;
    height: 43px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    opacity: .9;
    width: 33px;
    .van-icon {
      font-size: 24px;
    }

    &::before {
      content: '';
      width: 1px;
      height: 43px;
      background: url(./line.png) no-repeat;
      background-size: cover;
      position: absolute;
      top: 0px;
      left: 0px;
    }
  }
}
</style>
