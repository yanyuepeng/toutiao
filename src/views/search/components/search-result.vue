<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  props: {
    SearchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10
    }
  },
  methods: {
    async onLoad () {
      // 请求获取数据
      const { data } = await getSearchResult({
        page: this.page, // 页码
        per_page: this.perPage, // 每页大小
        q: this.SearchText // 搜索的字符
      })
      // 数据放到列表中
      const { results } = data.data
      this.list.push(...results)
      // 关闭本次的loading
      this.loading = false
      // 判断是否还有数据 有则加载更多
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped>
.search-result {
  position: fixed;
  left: 0;
  right: 0;
  top: 54px;
  bottom: 0;
  overflow-y: auto;
}
</style>
