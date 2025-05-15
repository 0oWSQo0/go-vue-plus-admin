<template>
  <Dialog title="修改 PIN 码" v-model="open" width="440px">
    <Form :rules="rules" :schema="schema" @register="formRegister" />
    <template #footer>
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { openDevice, openApp, changePin, getKeyInfo } from '@/utils/BHA'
import { Regular } from '@/utils/validate'
import { useUserStoreWithOut } from '@/store/modules/user'
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import type { FormSchema } from '@/components/Form'
import { getUserInfoApi } from '@/api/login'

const { proxy } = getCurrentInstance() as any
const userStore = useUserStoreWithOut()
const { push } = useRouter()
const { required, lengthRange } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods

const loginType = userStore.getLoginType
const open = ref(false)
const loading = ref(false)
const rules = ref<any>({
  newPin: [required(), lengthRange({ min: 8, max: 20 }), { pattern: Regular.checkPin(), message: 'PIN码应包含字母、数字、特殊字符' }],
  checkPin: [
    required(),
    {
      asyncValidator: async (_: any, value: any, callback: Function) => {
        const formData = await getFormData()
        if (formData.newPin !== value) {
          callback(new Error('两次输入的 PIN 码不一致'))
        } else {
          callback()
        }
      }
    }
  ]
})
const schema = ref<FormSchema[]>([
  { field: 'oldPin', hidden: true, label: '旧 PIN 码', component: 'Input', componentProps: { maxlength: 20, type: 'password', showPassword: true } },
  { field: 'newPin', label: '新 PIN 码', component: 'InputPassword', componentProps: { maxlength: 20, strength: true } },
  { field: 'checkPassword', label: '确认 PIN 码', component: 'InputPassword', componentProps: { maxlength: 20, strength: true } }
])
const reset = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}
const cancel = async () => {
  reset()
  open.value = false
  handleSubmit()
}
const handleSubmit = async () => {
  const formData = await getFormData()
  userStore.setToken(formData.token)
  const { user }: any = await getUserInfoApi()
  userStore.setUserInfo(user)
  push({ path: formData.redirect || '/' })
}
const submit = async () => {
  const elFormExpose = await getElFormExpose()
  await elFormExpose?.validate()
  loading.value = true
  try {
    const formData = await getFormData()
    const { hdevice } = await openDevice({ index: 0 })
    const { serialnumber } = await getKeyInfo({ hdevice })
    if (serialnumber !== formData.keyCode) {
      proxy.$modal.msgError('非当前用户UKEY')
      return
    }
    const happlication = await openApp({ hdevice, appName: 'user' })
    await changePin({ newPin: formData.newPin, oldPin: formData.oldPin, happlication })
    proxy.$modal.msgSuccess('PIN 码修改成功')
    userStore.setUkeyInfo({ pin: formData.newPin, keyCode: serialnumber })
    handleSubmit()
    open.value = false
  } finally {
    loading.value = false
  }
}

// 显示弹框
const show = async (row: any) => {
  open.value = true
  await reset()
  await setValues(row)
}

defineExpose({ show })
</script>
