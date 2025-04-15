<template>
  <Dialog title="修改口令" v-model="open" width="440px">
    <Form :rules="rules" :schema="schema" @register="formRegister" />
    <template #footer>
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { updatePwdApi } from '@/api/org/user'
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
  oldPwd: [required(), lengthRange({ min: 8, max: 20 }), { pattern: Regular.checkPin(), message: '口令应包含字母、数字、特殊字符' }],
  newPwd: [required(), lengthRange({ min: 8, max: 20 }), { pattern: Regular.checkPin(), message: '新口令应包含字母、数字、特殊字符' }],
  checkPwd: [
    required(),
    {
      asyncValidator: async (_: any, value: any, callback: any) => {
        const formData = await getFormData()
        if (formData.newPwd !== value) {
          callback(new Error('两次输入的口令不一致'))
        } else {
          callback()
        }
      }
    }
  ]
})
const schema = ref<FormSchema[]>([
  { field: 'oldPwd', label: '旧口令', component: 'Input', componentProps: { maxlength: 20, type: 'password', showPassword: true } },
  { field: 'newPwd', label: '新口令', component: 'InputPassword', componentProps: { maxlength: 20, strength: true } },
  { field: 'checkPwd', label: '确认口令', component: 'InputPassword', componentProps: { maxlength: 20, strength: true } }
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
    await updatePwdApi({ oldPassword: sm3(formData.oldPwd), newPassword: sm3(formData.newPwd) })
    proxy.$modal.msgSuccess('修改成功')
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
