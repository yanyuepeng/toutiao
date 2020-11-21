<template>
  <div class="search-history">
    <van-cell
      title="搜索历史"
    >
      <div v-if="isDeleteShow">
        <span @click="$emit('update-histories', [])">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon
        name="delete"
        v-else
        @click="isDeleteShow = true"
      />
    </van-cell>
    <van-cell
      :title="history"
      v-for="(history, index) in searchHistories"
      :key="index"
      @click="onDelete(history,index)"
    >
      <van-icon
        name="close"
        v-show="isDeleteShow"
      />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'component_name',
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false
    }
  },
  methods: {
    onDelete (history, index) {
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
        return
      }

      // 非删除执行搜索
      this.$emit('search', history)
    }
  }
}
</script>

<style scoped>
</style>
