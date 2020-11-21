<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索栏 -->

    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    />
    <!-- 搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- 联想建议 -->

    <!-- 历史搜索 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories = $event"
    />
    <!-- 历史搜索 -->
  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
// import { getSearchHistories } from '@/api/user'
import { mapState } from 'vuex'

export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: [] // 搜索历史数据
    }
  },
  computed: {
    ...mapState(['user'])
  },
  components: {
    SearchSuggestion, SearchHistory, SearchResult
  },
  created () {
    this.loadSearchHistories()
  },
  methods: {
    onSearch (searchText) {
      // 输入框设置为想要的文本
      this.searchText = searchText

      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        // 重复的删除
        this.searchHistories.splice(index, 1)
      }
      // 最新历史纪录放到顶部
      this.searchHistories.unshift(searchText)
      // 如果用户已登录 搜索记录存到线上
      // 只要调取搜索数据的接口  会自己存入
      // 未登录 存到本地
      // setItem('search-histories', this.searchHistories)
      // 展示搜索结果
      this.isResultShow = true
    },
    async loadSearchHistories () {
      const searchHistories = getItem('search-histories') || []
      // if (this.user) {
      //   const { data } = await getSearchHistories()
      //   searchHistories = [...new Set([...searchHistories, ...data.data.keywords])]
      // }
      this.searchHistories = searchHistories
    }
  },
  watch: {
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  }
}
</script>

<style scoped>
</style>
