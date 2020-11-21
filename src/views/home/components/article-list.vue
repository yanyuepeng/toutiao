<template>
  <div class="article-list" ref="article-list">
    <van-pull-refresh
      v-model="isPullDownLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article, index) in articles"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
import { debounce } from 'lodash'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articles: [],
      loading: false,
      finished: false,
      timestamp: null, // 获取下一页时间戳
      isPullDownLoading: false,
      refreshSuccessText: '', // 更新条数
      scrollTop: 0 // 列表到顶部距离
    }
  },
  computed: {},
  mounted () {
    const articleList = this.$refs['article-list']
    articleList.onscroll = debounce(() => {
      this.scrollTop = articleList.scrollTop
    }, 100)
  },
  activated () {
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  methods: {
    async onLoad () {
      // 获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 获取频道id
        timestamp: this.timestamp || Date.now(), // 获取页码  时间戳
        with_top: 1
      })
      // 数据放到list中
      const { results } = data.data
      this.articles.push(...results)
      // 本次加载结束 加载下一次
      this.loading = false
      // 如果有下一页 获取下一页页码
      if (results.length) {
        this.timestamp = data.data.pre_timestamp
      } else {
        this.finished = true
      }
    },

    async onRefresh () {
      // 获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      // 顶部加数据
      const { results } = data.data
      this.articles.unshift(...results)
      // 关闭刷新状态
      this.isPullDownLoading = false

      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 50px;
  overflow-y: auto;
}
</style>
