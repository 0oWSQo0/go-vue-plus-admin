<script lang="tsx">
import { computed, defineComponent, unref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Backtop } from '@/components/Backtop'
import { Setting } from '@/components/Setting'
import { useRenderLayout } from './components/useRenderLayout'
import { useDesign } from '@/hooks/useDesign'
// -------------
import { openDevice, getKeyInfo } from '@/utils/BHA'
import { useUserStore } from '@/store/modules/user'
import { LoginTypeEnum } from '@/views/Login/types'
import { loginOutApi } from '@/api/login'
import { ElMessageBox } from 'element-plus'
const userStore = useUserStore()
let timer: any = null
let logoutTime = 10
const checkKeyStatus = async () => {
  const keyCode = userStore.getUkeyInfo?.keyCode
  timer = setInterval(async () => {
    try {
      const { hdevice } = await openDevice({ index: 0 })
      const { serialnumber } = await getKeyInfo({ hdevice })
      if (keyCode != serialnumber) {
        clearInterval(timer)
        ElMessageBox.confirm(`<div id="testId">未检测到UKEY，即将退出登录！(${logoutTime})</div>`, '提示', {
          closeOnClickModal: false,
          showCancelButton: false,
          showClose: false,
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(async () => {
          await loginOutApi().catch(() => {})
          userStore.logout()
        })
        const logoutT = setInterval(async () => {
          const testId: any = document.querySelector('#testId')
          logoutTime--
          testId.innerHTML = `未检测到UKEY，即将退出登录！(${logoutTime})`
          if (logoutTime <= 0) {
            clearInterval(logoutT)
            logoutTime = 10
            await loginOutApi().catch(() => {})
            userStore.logout()
          }
        }, 1000)
      }
    } catch (e: any) {
      clearInterval(timer)
      e.msg && console.log(e.msg)
      await loginOutApi().catch(() => {})
      userStore.logout()
    }
  }, 2000)
}

userStore.getLoginType === LoginTypeEnum.Ukey && checkKeyStatus()
//------------

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('layout')

const appStore = useAppStore()

// 是否是移动端
const mobile = computed(() => appStore.getMobile)

// 菜单折叠
const collapse = computed(() => appStore.getCollapse)

const layout = computed(() => appStore.getLayout)

const hideSetting = computed(() => import.meta.env.VITE_HIDE_GLOBAL_SETTING === 'true')

const handleClickOutside = () => {
  appStore.setCollapse(true)
}

const renderLayout = () => {
  const { renderClassic, renderTopLeft, renderTop, renderCutMenu } = useRenderLayout()
  switch (unref(layout)) {
    case 'classic':
      return renderClassic()
    case 'topLeft':
      return renderTopLeft()
    case 'top':
      return renderTop()
    case 'cutMenu':
      return renderCutMenu()
    default:
      break
  }
}

export default defineComponent({
  name: 'Layout',
  setup() {
    return () => (
      <section class={[prefixCls, `${prefixCls}__${layout.value}`, 'w-[100%] h-[100%] relative']}>
        {mobile.value && !collapse.value ? <div class="absolute top-0 left-0 w-full h-full opacity-30 z-99 bg-[var(--el-color-black)]" onClick={handleClickOutside}></div> : undefined}

        {renderLayout()}

        <Backtop></Backtop>

        {!unref(hideSetting) && <Setting></Setting>}
      </section>
    )
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-layout';

.@{prefix-cls} {
  background-color: var(--app-content-bg-color);
}
</style>
