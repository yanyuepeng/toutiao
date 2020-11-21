<template>
  <div class="my-container">
    <van-cell-group class="my-info" v-if="user">
      <van-cell
        class="base-info"
        center
        :border="false"
      >
      <van-image
        class="avatar"
        slot="icon"
        round
        fit="cover"
        :src="currentUser.photo" />
      <div class="name" slot="title">{{ currentUser.name }}</div>
      <van-button
        class="update-btn"
        size="small"
        round
        to="/user/profile"
      >编辑资料</van-button>
      </van-cell>
      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{ currentUser.art_count }}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
          <div class="count">{{ currentUser.follow_count }}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{ currentUser.fans_count }}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{ currentUser.like_count }}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

  <van-grid class="not-login" :border="false" v-else>
    <van-grid-item
      icon="user-circle-o"
      @click="$router.push({
        name: 'login',
        query: {
          redirect: '/my'
        }
      })"
      text="登录/注册"
      class="not-login-avatar"
    />
  </van-grid>

    <van-grid :column-num="2" class="nav-grid mb-4">
      <van-grid-item icon-prefix="toutiao" icon="shoucang" text="收藏" class="nav-grid-item" />
      <van-grid-item icon-prefix="toutiao" icon="lishi" text="历史" class="nav-grid-item" />
    </van-grid>

    <van-cell title="消息通知" is-link to="/" />
    <van-cell title="小智同学" is-link class="mb-4" to="/user/chat" />
    <van-cell
      v-if="user"
      title="退出登录"
      class="logout-ceil"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data () {
    return {
      currentUser: {} // 当前用户信息
    }
  },
  computed: {
    ...mapState(['user'])
  },
  activated () {
    if (this.user) {
      this.loadCurrentUser()
    }
  },
  methods: {
    // 提示用户确认退出
    onLogout () {
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗？'
      })
        .then(() => {
          // on confirm
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
        })
    },
    async loadCurrentUser () {
      const { data } = await getCurrentUser()
      this.currentUser = data.data
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .my-info {
    background: url("./banner.png") no-repeat;
    background-size: cover;
    .base-info{
      box-sizing: border-box;
      height: 115px;
      background-color: unset;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .name{
        font-size: 15px;
        color: #fff;
      }
      .update-btn{
        height: 16px;
        font-size: 10px;
        color: #666666;
      }
    }
    .data-info{
      .data-info-item{
        height: 65px;
        color: #fff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {
            font-size: 18px;
          }
          .text{
            font-size: 11px;
          }
        }
      }
    }
    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }

  .not-login {
    height: 180px;
    background: url(./banner.png) no-repeat;
    background-size: cover;
    .not-login-avatar{
      margin: auto;
      /deep/ .van-grid-item__content{
        background-color: unset;
        .van-grid-item__icon{
          font-size: 50px;
          color: #fff;
        }
        .van-grid-item__text{
          font-size: 15px;
          color: #fff;
        }
      }
    }
  }

  /deep/ .nav-grid {
    .toutiao {
      font-size: 22px;
    }
    .toutiao-shoucang {
      color: #eb5253;
    }
    .toutiao-lishi {
      color: #ff9d1d;
    }
    .van-grid-item__text {
      font-size: 14px;
      color: #333333;
    }
  }

  .logout-ceil {
    text-align: center;
    color: #d86262;
  }

  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>
