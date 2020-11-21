<template>
  <div class="comment-reply">
    <!-- 头部信息 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon
        name="cross"
        slot="left"
        @click="$emit('close')"
      />
    </van-nav-bar>
    <!-- 头部信息 -->

    <!-- 当前评论项 -->
    <comment-item
      :comment="comment"
    />
    <!-- 当前评论项 -->

    <!-- 所有评论的回复 -->
    <van-cell title="所有回复" />
    <comment-list
      :source="comment.com_id"
      type="c"
      :list="CommentList"
      />
    <!-- 所有评论的回复 -->

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
      >写评论</van-button>
    </div>
    <!-- 底部区域 -->

    <!-- 发布回复评论 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
      <post-comment
        :target="comment.com_id"
        :article-id="articleId"
        @post-success="onPostSuccess"
      />
    </van-popup>
    <!-- 发布回复评论 -->
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import PostComment from './post-comment'

export default {
  name: 'CommentReply',
  components: {
    CommentItem, CommentList, PostComment
  },
  props: {
    // 查看评论的回复项
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      isPostShow: false,
      CommentList: [] // 评论的回复列表
    }
  },
  methods: {
    onPostSuccess (comment) {
      this.CommentList.unshift(comment)
      this.comment.reply_count++
      this.isPostShow = false
    }
  }
}
</script>

<style scoped lang="less">
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  .comment-btn {
    width: 200px;
    height: 30px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
}
</style>
