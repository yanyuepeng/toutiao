<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidclick: true
      })
      // const date = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth}-${this.currentDate.getDate}`
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')
      await updateUserProfile({
        // birthday: date
        birthday: date
      })
      this.$emit('input', date)
      this.$emit('close')
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped>
</style>
