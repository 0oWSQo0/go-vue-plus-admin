<template>
  <Dialog title="绑定UKEY" v-model="open" width="400">
    <Form :rules="rules" :schema="schema" @register="formRegister" />
    <template #footer>
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { openDevice, openApp, openContainer, getKeyInfo, checkPin, createApp, writeFile, generateCSR } from '@/utils/BHA'
import { Regular } from '@/utils/validate'
import { useUserStore } from '@/store/modules/user'
import { LoginTypeEnum } from '@/views/Login/types'
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import type { FormSchema } from '@/components/Form'
import { bindKeyApi } from '@/api/system/user'

const { proxy } = getCurrentInstance() as any
const emits = defineEmits(['submit'])
const userStore = useUserStore()
const loginType = userStore.getLoginType

const { required, lengthRange } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods

const open = ref(false)
const loading = ref(false)
const rules = ref<any>({
  pin: [required(), lengthRange({ min: 8, max: 20 }), { pattern: Regular.checkPin(), message: 'PIN码应包含字母、数字、特殊字符' }],
  checkPin: [
    required(),
    {
      asyncValidator: async (_: any, value: any, callback: Function) => {
        const formData = await getFormData()
        if (formData.pin !== value) {
          callback(new Error('两次输入的 PIN 码不一致'))
        }
        callback()
      }
    }
  ]
})
const schema = ref<FormSchema[]>([{ field: 'pin', label: 'PIN 码', component: 'Input', componentProps: { maxlength: 20, type: 'password', showPassword: true } }])

const reset = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}

const submit = async () => {
  const elFormExpose = await getElFormExpose()
  await elFormExpose?.validate()
  try {
    loading.value = true
    const formData = await getFormData()
    const { hdevice } = await openDevice({ index: loginType === LoginTypeEnum.DEFAULT ? 0 : 1 })
    await createApp({ hdevice, appName: 'user', userPin: formData.pin })
    const happlication = await openApp({ hdevice, appName: 'user' })
    await checkPin({ happlication, pin: formData.pin })
    const hcontainer = await openContainer({ happlication, containerName: 'user' })
    const Csr = await generateCSR({ hdevice, hcontainer, szCN: formData.username })
    const { serialnumber } = await getKeyInfo({ hdevice })
    const { data }: any = await bindKeyApi({ Csr, keyCode: serialnumber, userId: formData.userId, userName: formData.username })
    await writeFile({ happlication, filename: 'pkey', data })
    proxy.$modal.msgSuccess('绑定成功')
    emits('submit')
    open.value = false
  } catch (e: any) {
    console.log(e)
    e.msg && proxy.$modal.msgError(e.msg)
  } finally {
    loading.value = false
  }
}

const show = async (row: any) => {
  open.value = true
  reset()
  if (row) {
    await setValues(row)
  }
}

defineExpose({ show })
</script>
