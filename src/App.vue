<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { ConfigGlobal } from '@/components/ConfigGlobal'
import { useDesign } from '@/hooks/useDesign'
import { ElNotification } from 'element-plus'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('app')

const appStore = useAppStore()

const currentSize = computed(() => appStore.getCurrentSize)

const greyMode = computed(() => appStore.getGreyMode)

appStore.initTheme()

if (appStore.getTipCount < 3) {
  appStore.setTipCount(appStore.getTipCount + 1)
  ElNotification({
    title: '提示',
    type: 'success',
    duration: 8000,
    dangerouslyUseHTMLString: true,
    message: `<div><p><strong>欢迎使用${appStore.getTitle}！</strong></p></div>`
  })
}
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
</template>

<style lang="less">
@prefix-cls: ~'@{adminNamespace}-app';

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  .size;

  #app {
    .size;
  }
}

.@{prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
