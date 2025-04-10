<script setup lang="ts">
import { ElDialog, ElScrollbar } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { isNumber } from '@/utils/is'

const slots = useSlots()

const props = defineProps({
  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def(''),
  fullscreen: propTypes.bool.def(false),
  maxHeight: propTypes.oneOfType([String, Number]).def('600px')
})

const getBindValue = computed(() => {
  const delArr: string[] = ['fullscreen', 'title', 'maxHeight']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})

const isFullscreen = ref(false)

const toggleFull = () => {
  isFullscreen.value = !unref(isFullscreen)
}

const dialogHeight = ref(isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight)

watch(
  () => isFullscreen.value,
  async (val: boolean) => {
    await nextTick()
    if (val) {
      const windowHeight = document.documentElement.offsetHeight
      dialogHeight.value = `${windowHeight - 55 - 60 - (slots.footer ? 63 : 0)}px`
    } else {
      dialogHeight.value = isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight
    }
  },
  {
    immediate: true
  }
)

watch(
  () => props.maxHeight,
  (val) => {
    dialogHeight.value = isNumber(val) ? `${val}px` : val
  }
)

const dialogStyle = computed(() => {
  return unref(dialogHeight)
})
</script>

<template>
  <ElDialog v-bind="getBindValue" :fullscreen="isFullscreen" destroy-on-close lock-scroll draggable top="0" :close-on-click-modal="false" :show-close="false">
    <template #header="{ close }">
      <div class="flex justify-between items-center h-40px pl-10px pr-10px relative">
        <slot name="title">
          {{ title }}
        </slot>
        <div class="h-40px flex justify-between items-center absolute top-[50%] right-15px translate-y-[-50%]">
          <Icon
            v-if="fullscreen"
            class="cursor-pointer is-hover !h-40px mr-10px hover:scale-150"
            :icon="isFullscreen ? 'vi-radix-icons:exit-full-screen' : 'vi-radix-icons:enter-full-screen'"
            color="var(--el-color-info)"
            hover-color="var(--el-color-primary)"
            @click="toggleFull"
          />
          <Icon class="cursor-pointer is-hover !h-40px hover:scale-150" icon="vi-ep:close" hover-color="var(--el-color-primary)" color="var(--el-color-info)" @click="close" />
        </div>
      </div>
    </template>

    <ElScrollbar :max-height="dialogStyle">
      <slot></slot>
    </ElScrollbar>

    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </ElDialog>
</template>

<style lang="less">
.@{elNamespace}-overlay-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
}

.@{elNamespace}-dialog {
  margin: 0 !important;

  &__header {
    height: 40px;
    padding: 0;
    margin-right: 0 !important;
    border-bottom: 1px solid var(--el-border-color);
  }

  &__body {
    padding: 8px !important;
  }

  &__footer {
    border-top: 1px solid var(--el-border-color);
    padding-top: 10px !important;
  }

  &__headerbtn {
    top: 0;
  }
}
</style>
