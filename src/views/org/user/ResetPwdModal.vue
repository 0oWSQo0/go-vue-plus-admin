<template>
  <Dialog title="重置口令" v-model="open" width="440px">
    <Form :rules="rules" :schema="schema" @register="formRegister" />
    <template #footer>
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { resetPwdApi } from '@/api/org/user'
import { Regular } from '@/utils/validate'
import { sm3 } from 'sm-crypto'
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import type { FormSchema } from '@/components/Form'

const { proxy } = getCurrentInstance() as any
const { required, lengthRange } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods

const open = ref(false)
const loading = ref(false)
const rules = ref<any>({
  password: [required(), lengthRange({ min: 8, max: 20 }), { pattern: Regular.checkPin(), message: '口令应包含字母、数字、特殊字符' }],
  checkPassword: [
    required(),
    {
      asyncValidator: async (_: any, value: any, callback: Function) => {
        const formData = await getFormData()
        if (formData.password !== value) {
          callback(new Error('两次输入的口令不一致'))
        }
        callback()
      }
    }
  ]
})
const schema = ref<FormSchema[]>([
  { field: 'password', label: '新口令', component: 'InputPassword', componentProps: { maxlength: 20, strength: true } },
  { field: 'checkPassword', label: '确认口令', component: 'InputPassword', componentProps: { maxlength: 20, strength: true } }
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
    await resetPwdApi({ ...formData, password: sm3(formData.password) })
    proxy.$modal.msgSuccess('重置口令成功')
    open.value = false
  } finally {
    loading.value = false
  }
}

// 显示弹框
const show = async (row: any) => {
  open.value = true
  reset()
  await nextTick()
  setValues(row)
}

defineExpose({ show })
</script>
