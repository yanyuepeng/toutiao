<template>
  <div class="post-comment">
    <van-field
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      size="mini"
      class="post-btn"
      @click="onPost"
      :disabled="!message"
    >发布</van-button>
  </div>
</template>
<script>
import { addComment } from '@/api/comment'

export default {
  name: 'PostComment',
  data () {
    return {
      message: '' // 输入框内容
    }
  },
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  methods: {
    async onPost () {
      this.$toast.loading({
        message: '发布中',
        forbidClick: true
      })
      const { data } = await addComment({
        target: this.target.toString(), // 评论目标id
        content: this.message, // 评论内容
        art_id: this.articleId ? this.articleId.toString() : null // 文章id 对评论内容发表回复所需
      })
      this.$emit('post-success', data.data.new_obj)
      this.$toast.success('发布成功')
      this.message = ''
    }
  }
}
</script>
<style scoped lang="less">
.post-comment {
  padding: 14px;
  display: flex;
  align-items: center;
  .post-btn {
    width: 50px;
    height: 25px;
    background-color: #4c7dfa;
  }
}
</style>
