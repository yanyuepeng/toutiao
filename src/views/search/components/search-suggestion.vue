<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(str, index) in suggestions"
      :key="index"
      @click="$emit('search', str)"
    >
      <div slot="title" v-html="highlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  methods: {
    highlight (str) {
      return str.replace(
        new RegExp(this.searchText, 'gi'),
        `<span style="color: red">${this.searchText}</span>`
      )
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  watch: {
    searchText: {
      handler: debounce(async function () {
        // 找到数据接口
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 200),
      immediate: true
    }
  }
}
</script>

<style scoped>
</style>
