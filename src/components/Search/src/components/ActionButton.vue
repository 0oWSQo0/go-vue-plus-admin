<script setup lang="ts">
import { useIcon } from '@/hooks/useIcon'
import { propTypes } from '@/utils/propTypes'

const emit = defineEmits(['search', 'reset', 'expand'])

defineProps({
  showSearch: propTypes.bool.def(true),
  showReset: propTypes.bool.def(true),
  showExpand: propTypes.bool.def(false),
  visible: propTypes.bool.def(true),
  searchLoading: propTypes.bool.def(false),
  resetLoading: propTypes.bool.def(false)
})

const onSearch = () => {
  emit('search')
}

const onReset = () => {
  emit('reset')
}

const onExpand = () => {
  emit('expand')
}
</script>

<template>
  <ElButton v-if="showSearch" type="primary" :loading="searchLoading" :icon="useIcon({ icon: 'vi-ep:search' })" @click="onSearch">搜索</ElButton>
  <ElButton v-if="showReset" :loading="resetLoading" plain :icon="useIcon({ icon: 'vi-ep:refresh-right' })" @click="onReset">重置</ElButton>
  <ElButton v-if="showExpand" :icon="useIcon({ icon: visible ? 'vi-ep:arrow-up' : 'vi-ep:arrow-down' })" text @click="onExpand">
    {{ visible ? '收起' : '展开' }}
  </ElButton>
</template>
