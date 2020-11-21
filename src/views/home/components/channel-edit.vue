<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button
        type='danger'
        round
        plain
        size="mini"
        @click="isEdit = !isEdit"
      >
      {{ isEdit ? '完成' : '编辑' }}
      </van-button>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        :class="{ active: index === active }"
        :icon="isEdit && index !==0 ? 'clear' : ''"
        v-for="(channel,index) in userChannels"
        :key="index"
        :text="channel.name"
        @click="onUserChannelClick(channel, index)"
      />
    </van-grid>

    <van-cell :border="false" center>
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel,index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
import { addUserChannel, deleteUserChannel } from '@/api/user'

export default {
  name: 'ChannelEdit',
  data () {
    return {
      allChannels: [], // 所有频道列表
      isEdit: false // 控制编辑显示状态
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },

    async onAdd (channel) {
      this.userChannels.push(channel)
      // 数据持久化
      if (this.user) {
        await addUserChannel({
          channels: [
            { id: channel.id, seq: this.userChannels.length }
          ]
        })
      } else {
        setItem('user-channels', this.userChannels)
      }
    },

    onUserChannelClick (channel, index) {
      if (this.isEdit && index !== 0) {
        this.deleteChannel(channel, index)
      } else {
        this.switchChannel(index)
      }
    },

    async deleteChannel (channel, index) {
      // 删除频道
      this.userChannels.splice(index, 1)
      if (index <= this.active) {
        this.$emit('update-active', this.active - 1)
      }
      // 数据持久化
      if (this.user) {
        await deleteUserChannel(channel.id)
      } else {
        setItem('user-channels', this.userChannels)
      }
    },

    switchChannel (index) {
      // 切换频道
      this.$emit('update-active', index)
      this.$emit('close')
    }
  },
  computed: {
    ...mapState(['user']),
    // 推荐频道 = 所有 - 我的
    recommendChannels () {
      return this.allChannels.filter(channel => {
        return !this.userChannels.find(userChannel => {
          return userChannel.id === channel.id
        })
      })
    }
  },
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 54px;
  .channel-title {
    font-size: 16px;
    color: #333;
  }

  .grid-item {
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/ .van-grid-item__icon {
      position: absolute;
      right: -5px;
      top: -5px;
      font-size: 20px;
      color: #ccc;
    }
  }

  .active {
    /deep/ .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>
