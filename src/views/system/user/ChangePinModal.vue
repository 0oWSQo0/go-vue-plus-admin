<template>
  <Dialog title="修改 PIN 码" v-model="open" width="440px">
    <Form :rules="rules" :schema="schema" @register="formRegister" />
    <template #footer>
      <el-button @click="open = false">取 消</el-button>
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
import { LoginTypeEnum } from '@/views/Login/types'

const { proxy } = getCurrentInstance() as any

const { required, lengthRange } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods

const userStore = useUserStoreWithOut()
const loginType = userStore.getLoginType
const open = ref(false)
const loading = ref(false)
const rules = ref<any>({
  oldPin: [required()],
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
  { field: 'oldPin', label: '旧 PIN 码', component: 'Input', componentProps: { maxlength: 20, type: 'password', showPassword: true } },
  { field: 'newPin', label: '新 PIN 码', component: 'InputPassword', componentProps: { maxlength: 20, strength: true } },
  { field: 'checkPassword', label: '确认 PIN 码', component: 'InputPassword', componentProps: { maxlength: 20, strength: true } }
])
const reset = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}
const submit = async () => {
  const elFormExpose = await getElFormExpose()
  await elFormExpose?.validate()
  loading.value = true
  try {
    const formData = await getFormData()
    const { hdevice } = await openDevice({ index: loginType === LoginTypeEnum.DEFAULT ? 0 : 1 })
    const { serialnumber } = await getKeyInfo({ hdevice })
    if (serialnumber !== formData.keyCode) {
      proxy.$modal.msgError('非当前用户UKEY')
      return
    }
    const happlication = await openApp({ hdevice, appName: 'user' })
    await changePin({ newPin: formData.newPin, oldPin: formData.oldPin, happlication })
    loginType === LoginTypeEnum.UKEY && userStore.setUkeyInfo({ pin: formData.newPin, keyCode: formData.keyCode })
    proxy.$modal.msgSuccess('PIN 码修改成功')
    open.value = false
  } finally {
    loading.value = false
  }
}

// 显示弹框
const show = async (row: any) => {
  open.value = true
  reset()
  await setValues(row)
}

defineExpose({ show })
</script>
