<script setup lang="ts">
import { useDesign } from '@/hooks/useDesign'
import { loginApi, getCodeApi, getUserInfoApi, randomStringApi } from '@/api/login'
import { useAppStore } from '@/store/modules/app'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useValidator } from '@/hooks/useValidator'
import { useUserStore } from '@/store/modules/user'
import { sm3 } from 'sm-crypto'
import { LoginTypeEnum } from './types'
import { openDevice, openApp, getKeyInfo, checkPin, generateRandom, sm2Sign, sm3 as bsm3, openContainer } from '@/utils/BHA'
import { getConfigKey } from '@/api/system/config'
import { Base64 } from 'js-base64'

const { proxy } = getCurrentInstance() as any
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
const appStore = useAppStore()
const { currentRoute, push } = useRouter()
const { required } = useValidator()
const userStore = useUserStore()

const loginType = ref<LoginTypeEnum>(LoginTypeEnum.DEFAULT)
const formRef = ref<any>()
const form = ref<any>({})
const rules = {
  username: [required()],
  password: [required()],
  code: [required()]
}
const loading = ref(false)
const redirect = ref<string>('')
const codeUrl = ref('')
// 验证码开关
const captchaEnabled = ref(true)

const handleLogin = async () => {
  await formRef.value?.validate()
  unref(loginType) === LoginTypeEnum.DEFAULT ? commonLogin() : ukeyLogin()
}

/**
 * 普通登录方式
 */
const commonLogin = async () => {
  loading.value = true
  try {
    const { data }: any = await loginApi({ ...unref(form), password: sm3(unref(form).password) })
    userStore.setToken(data.token)
    const res: any = await getUserInfoApi()
    userStore.setUserInfo(res.data)
    push({ path: redirect.value || '/' })
  } catch (e: any) {
    console.error(e)
    // 重新获取验证码
    captchaEnabled.value && getCode()
  } finally {
    loading.value = false
  }
}
/**
 * 获取验证码
 */
const getCode = async () => {
  const { data }: any = await getCodeApi()
  if (unref(captchaEnabled)) {
    codeUrl.value = data.base64
    form.value.cid = data.cid
  }
}

/**
 * BHA ukey登录
 */
const changePinRef = ref()
const ukeyLogin = async () => {
  loading.value = true
  try {
    const { hdevice } = await openDevice({ index: 0 })
    const happlication = await openApp({ hdevice, appName: 'user' })
    await checkPin({ pin: unref(form).pin, happlication })
    const hcontainer = await openContainer({ happlication, containerName: 'user' })
    const { serialnumber } = await getKeyInfo({ hdevice })
    // // 拼随机数
    const randomA = await generateRandom({ len: 16, hdevice })
    const arr1: any = [],
      arr2: any = []
    for (const ch of Base64.atob(randomA)) {
      arr1.push(ch.codePointAt(0))
    }
    const randomB = await randomStringApi({ keyCode: serialnumber })
    for (const ch of Base64.atob(randomB.data)) {
      arr2.push(ch.codePointAt(0))
    }
    const buffer = new Uint8Array([...arr1, ...arr2])
    const randomAB = Base64.fromUint8Array(buffer)
    const plaindata = await bsm3({ hdevice, hcontainer, indata: randomAB, withPublicKey: true, id: 'MTIzNDU2NzgxMjM0NTY3OA==' })
    const signData = await sm2Sign({ hcontainer, plaindata })
    const obj = {
      ...unref(form),
      password: sm3(unref(form).password),
      keyCode: serialnumber,
      randomA,
      randomB,
      randomAB,
      signData
    }
    const { data }: any = await loginApi(obj)
    loading.value = false
    // 首次登录的用户需要修改PIN码
    if (data.modify != 1) {
      changePinRef.value.show({ oldPin: unref(form).pin, keyCode: serialnumber, token: data.token })
    } else {
      userStore.setToken(data.token)
      const res: any = await getUserInfoApi()
      userStore.setUserInfo(res.data)
      useUserStore().setUkeyInfo({ pin: unref(form).pin, keyCode: serialnumber })
      push({ path: redirect.value || '/' })
    }
  } catch (e: any) {
    e.msg && proxy.$modal.msgError(e.msg)
    loading.value = false
    // 重新获取验证码
    captchaEnabled.value && getCode()
  }
}

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  { immediate: true }
)
/**
 * 初始化登录方式
 */
const init = async () => {
  const { msg }: any = await getConfigKey('sys.loginType')
  userStore.setLoginType(msg)
  loginType.value = msg
}

// init()
getCode()
</script>

<template>
  <div :class="prefixCls" class="h-[100%] relative">
    <h2 class="mb-32 text-6xl bg-clip-text bg-[var(--el-color-primary)] text-transparent bg-gradient-to-r from-pink-500 to-violet-500 tracking-[0.4em] animate__animated animate__zoomIn">{{
      appStore.getTitle
    }}</h2>
    <el-form ref="formRef" :model="form" :rules="rules" class="p-6 shadow-lg rounded-lg w-96 shadow-gray-800 !backdrop-blur bg-white/30">
      <el-form-item prop="username">
        <el-input v-model="form.username" type="text" size="large" auto-complete="off" autofocus placeholder="请输入账号" maxlength="30">
          <template #prepend><Icon :size="20" icon="vi-ant-design:user-outlined" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" size="large" auto-complete="off" placeholder="请输入口令" maxlength="20" show-password>
          <template #prepend><Icon :size="20" icon="vi-ant-design:lock-outlined" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="pin" v-if="loginType === 'ukey'">
        <el-input v-model="form.pin" type="password" size="large" auto-complete="off" placeholder="请输入PIN码" maxlength="20" show-password>
          <template #prepend><Icon :size="20" icon="vi-ant-design:usb-outlined" /></template>
        </el-input>
      </el-form-item>
      <el-form-item class="code" prop="code" v-if="captchaEnabled">
        <el-input v-model="form.code" size="large" auto-complete="off" placeholder="请输入验证码" maxlength="10" @keyup.enter="handleLogin">
          <template #prepend><Icon :size="20" icon="vi-ant-design:safety-outlined" /></template>
          <template #suffix><img :src="codeUrl" @click="getCode" class="pl-2 cursor-pointer h-10 overflow-hidden" /></template>
        </el-input>
      </el-form-item>
      <el-button :loading="loading" size="large" type="primary" style="width: 100%" @click.prevent="handleLogin">
        <span>{{ !loading ? '登 录' : '登 录 中...' }}</span>
      </el-button>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-login';

.@{prefix-cls} {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: url('@/assets/imgs/bg.png') no-repeat center center;
  background-size: cover;
  :deep(.@{elNamespace}-input-prepend) {
    padding: 0 10px;
  }

  .code {
    :deep(.@{elNamespace}-input__wrapper) {
      padding-right: 0;
    }
  }
}
</style>
