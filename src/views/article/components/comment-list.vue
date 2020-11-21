<template>
  <div class="comment-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment-item
        v-for="(comment, index) in list"
        :key="index"
        :comment="comment"
        @reply-click="$emit('reply-click', $event)"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  props: {
    // 获取文章评论 传文章id ；获取评论回复 传评论id
    source: {
      type: [Number, String, Object],
      required: true
    },
    // 获取文章评论字符a  获取评论回复字符c
    type: {
      type: String,
      default: 'a'
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    CommentItem
  },
  data () {
    return {
      loading: false,
      finished: false,
      offset: null, // 第一页开始读
      limit: 10 // 每页十条
    }
  },
  methods: {
    async onLoad () {
      // 请求获取数据
      const { data } = await getComments({
        type: this.type, // 评论类型 a文章评论 c文章回复
        source: this.source.toString(), // 文章id 评论id
        offset: this.offset, // 页码
        limit: this.limit // 每页刷新多少
      })
      this.$emit('update-total-count', data.data.total_count)
      // 数据放到列表
      const { results } = data.data
      this.list.push(...results)
      // 本次loading关闭
      this.loading = false
      // 判断是否还有数 有 更新获取下一页页码 无 finished
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
