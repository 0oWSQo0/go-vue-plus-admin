<script setup lang="ts">
import { ElSwitch, ElMessage } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { computed, ref, watch } from 'vue'
import { setCssVar } from '@/utils'
import { useDesign } from '@/hooks/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('interface-display')

const appStore = useAppStore()

// 面包屑
const breadcrumb = ref(appStore.getBreadcrumb)

const breadcrumbChange = (show: boolean) => {
  appStore.setBreadcrumb(show)
}

// 面包屑图标
const breadcrumbIcon = ref(appStore.getBreadcrumbIcon)

const breadcrumbIconChange = (show: boolean) => {
  appStore.setBreadcrumbIcon(show)
}

// 折叠图标
const hamburger = ref(appStore.getHamburger)

const hamburgerChange = (show: boolean) => {
  appStore.setHamburger(show)
}

// 全屏图标
const screenfull = ref(appStore.getScreenfull)

const screenfullChange = (show: boolean) => {
  appStore.setScreenfull(show)
}

// 尺寸图标
const size = ref(appStore.getSize)

const sizeChange = (show: boolean) => {
  appStore.setSize(show)
}

// 标签页
const tagsView = ref(appStore.getTagsView)

const tagsViewChange = (show: boolean) => {
  // 切换标签栏显示时，同步切换标签栏的高度
  setCssVar('--tags-view-height', show ? '35px' : '0px')
  appStore.setTagsView(show)
}

// 标签页图标
const tagsViewIcon = ref(appStore.getTagsViewIcon)

const tagsViewIconChange = (show: boolean) => {
  appStore.setTagsViewIcon(show)
}

// logo
const showLogo = ref(appStore.getShowLogo)
const showLogoChange = (show: boolean) => {
  appStore.setShowLogo(show)
}

const showTitle = ref(appStore.getShowTitle)
const showTitleChange = (show: boolean) => {
  appStore.setShowTitle(show)
}

// 菜单手风琴
const uniqueOpened = ref(appStore.getUniqueOpened)

const uniqueOpenedChange = (uniqueOpened: boolean) => {
  appStore.setUniqueOpened(uniqueOpened)
}

// 固定头部
const fixedHeader = ref(appStore.getFixedHeader)

const fixedHeaderChange = (show: boolean) => {
  appStore.setFixedHeader(show)
}

// 页脚
const footer = ref(appStore.getFooter)

const footerChange = (show: boolean) => {
  appStore.setFooter(show)
}

// 灰色模式
const greyMode = ref(appStore.getGreyMode)

const greyModeChange = (show: boolean) => {
  appStore.setGreyMode(show)
}

// 动态路由
const dynamicRouter = ref(!!appStore.getDynamicRouter)

const dynamicRouterChange = (show: boolean) => {
  ElMessage.info('请重新退出登录体验')
  appStore.setDynamicRouter(show)
}

// 固定菜单
const fixedMenu = ref(appStore.getFixedMenu)

const fixedMenuChange = (show: boolean) => {
  appStore.setFixedMenu(show)
}

const layout = computed(() => appStore.getLayout)

watch(
  () => layout.value,
  (n) => {
    if (n === 'top') {
      appStore.setCollapse(false)
    }
  }
)
</script>

<template>
  <div :class="prefixCls">
    <div class="flex justify-between items-center">
      <span class="text-14px">是否显示面包屑</span>
      <ElSwitch v-model="breadcrumb" @change="breadcrumbChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">面包屑图标</span>
      <ElSwitch v-model="breadcrumbIcon" @change="breadcrumbIconChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">折叠图标</span>
      <ElSwitch v-model="hamburger" @change="hamburgerChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">全屏图标</span>
      <ElSwitch v-model="screenfull" @change="screenfullChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">尺寸图标</span>
      <ElSwitch v-model="size" @change="sizeChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">标签页</span>
      <ElSwitch v-model="tagsView" @change="tagsViewChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">标签页图标</span>
      <ElSwitch v-model="tagsViewIcon" @change="tagsViewIconChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">展示Logo</span>
      <ElSwitch v-model="showLogo" @change="showLogoChange" />
    </div>
    <div class="flex justify-between items-center">
      <span class="text-14px">展示title</span>
      <ElSwitch v-model="showTitle" @change="showTitleChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">菜单手风琴</span>
      <ElSwitch v-model="uniqueOpened" @change="uniqueOpenedChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">固定头部</span>
      <ElSwitch v-model="fixedHeader" @change="fixedHeaderChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">页脚</span>
      <ElSwitch v-model="footer" @change="footerChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">灰色模式</span>
      <ElSwitch v-model="greyMode" @change="greyModeChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">开启动态路由</span>
      <ElSwitch v-model="dynamicRouter" @change="dynamicRouterChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">固定菜单</span>
      <ElSwitch v-model="fixedMenu" @change="fixedMenuChange" />
    </div>
  </div>
</template>
