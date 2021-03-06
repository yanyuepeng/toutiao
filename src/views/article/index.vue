<template>
  <div class="article-container">
    <!-- 导航栏 -->
     <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 导航栏 -->
    <div class="article-wrap">
      <h1 class="title">{{ article.title }}</h1>

      <van-cell center class="user-info">
        <div slot="title" class="name">{{ article.aut_name}}</div>
        <van-image
          slot="icon"
          class="avatar"
          round
          fit="cover"
          :src="article.aut_photo"
        />
        <div slot="label" class="pubdate">{{ article.pubdate | relativeTime}}</div>
        <van-button
          round
          class="follow-btn"
          size="samll"
          :loading='isFollowLoading'
          :type="article.is_followed ? 'default' : 'info'"
          :icon="article.is_followed ? '' : 'plus'"
          @click="onFollow"
        >{{ article.is_followed ? '已关注' : '关注' }}</van-button>
      </van-cell>

      <div
        class="markdown-body"
        v-html="article.content"
        ref="article-content"
      ></div>

      <!-- 文章评论 -->
      <comment-list
        :source="articleId"
        :list="commentList"
        @update-total-count="totalCommentCount = $event"
        @reply-click="onReplyClick"
      />
      <!-- 文章评论 -->
    </div>
    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
      >写评论</van-button>
      <van-icon
        name="comment-o"
        :badge="totalCommentCount"
        color="#777"
      />
      <van-icon
        :name="article.is_collected ? 'star' : 'star-o'"
        :color="article.is_collected ? 'orange' : '#777'"
        @click="onCollect"
      />
      <van-icon
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        :color="article.attitude === 1 ? 'orange' : '#777777'"
        @click="onLike"
      />
      <van-icon
        name="share"
        color="#777777"
      />
    </div>
    <!-- 底部区域 -->

    <!-- 发布评论 -->
      <van-popup
        v-model="isPostShow"
        position="bottom"
      >
        <post-comment :target="articleId" @post-success="onPostSuccess" />
      </van-popup>
    <!-- 发布评论 -->

    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
    >
      <comment-reply
        v-if="isReplyShow"
        :comment="replyComment"
        :article-id="articleId"
        @close="isReplyShow = false"
      />
    </van-popup>
    <!-- 评论回复 -->
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleById, addCollect, deleteCollect, addLike, deleteLike } from '@/api/article'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user'
import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  // 组件中获取动态路由参数
  // 方式一 this.$router.params.articleId
  // 方式二 propos 传参 推荐
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  components: {
    CommentList, PostComment, CommentReply
  },
  data () {
    return {
      article: {},
      isFollowLoading: false, // 关注按钮状态
      isCollectLoading: false, // 收藏按钮状态
      isPostShow: false, // 控制发布评论显示状态
      commentList: [], // 文章数组列表
      totalCommentCount: 0, // 评论总数
      isReplyShow: false, // 回复显示状态
      replyComment: {} // 当前回复评论对象
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data

      // img图片预览
      this.$nextTick(() => {
        this.handlePerviewImage()
      })
    },

    handlePerviewImage () {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = []
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          ImagePreview({
            images: imgPaths,
            startPosition: index
          })
        }
      })
    },

    async onFollow () {
      this.isFollowLoading = true
      if (this.article.is_followed) {
        await deleteFollow(this.article.aut_id)
      } else {
        await addFollow(this.article.aut_id)
      }
      this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false
    },

    async onLike () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      if (this.article.attitude === 1) {
        await deleteLike(this.articleId)
        this.article.attitude = -1
      } else {
        await addLike(this.articleId)
        this.article.attitude = 1
      }
      this.$toast.success(`${this.article.attitude === 1 ? '' : '取消'}点赞成功`)
    },
    async onCollect () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      if (this.article.is_collected) {
        await deleteCollect(this.articleId)
      } else {
        await addCollect(this.articleId)
      }
      this.article.is_collected = !this.article.is_collected
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },
    onPostSuccess (comment) {
      // 最新评论放到列表顶部 更新评论总数 关闭弹出层
      this.commentList.unshift(comment)
      this.totalCommentCount++
      this.isPostShow = false
    },
    onReplyClick (comment) {
      this.replyComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
.article-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}

.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
  background-color: #fff;
  margin: 0;
}
.user-info {
  .name {
    font-size: 15px;
    color: #333333;
  }
  .pubdate {
    font-size: 11px;
    color: #b4b4b4;
  }
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .follow-btn {
    width: 85px;
    height: 29px;
  }
}

ul {
  list-style: unset;
}

.markdown-body {
  padding: 14px;
  background-color: #fff;
}

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
    width: 141px;
    height: 23px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 20px;
    .van-info {
      font-size: 11px;
      background-color: #e22829;
    }
  }
}
</style>
