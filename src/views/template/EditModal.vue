<script setup lang="ts">
import { Regular } from '@/utils/validate'
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import type { FormSchema } from '@/components/Form'

const { proxy } = getCurrentInstance() as any
const emits = defineEmits(['submit'])
const { required, lengthRange } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods

const open = ref(false)
const loading = ref(false)
const title = ref('')
const rules = ref<any>({
  userName: [required(), lengthRange({ min: 4, max: 20 }), { pattern: Regular.Account_number(), message: '用户名账号以字母开头，只能包含字母、数字和下划线' }],
  roleIds: [required()],
  nickName: [required(), lengthRange({ min: 2, max: 20 })],
  password: [required(), lengthRange({ min: 8, max: 20 }), { pattern: Regular.checkPin(), message: '口令应包含字母、数字、特殊字符' }],
  checkPassword: [required(), lengthRange({ min: 8, max: 20 }), { pattern: Regular.checkPin(), message: '确认口令应包含字母、数字、特殊字符' }]
})
const schema = ref<FormSchema[]>([
  { field: 'name', label: '资源名称', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'type', label: '资源类型', component: 'Input', componentProps: { maxlength: 20 } }
])

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
    console.log(formData)
    //   form.value.userId ? await updateUser(unref(form)) : await addUser(unref(form))
    proxy.$modal.msgSuccess(`${unref(title)}成功`)
    open.value = false
    emits('submit')
  } finally {
    loading.value = false
  }
}

const show = async (row: any) => {
  title.value = row ? '修改' : '新增'
  open.value = true
  reset()
  if (row) {
    await nextTick()
    setValues(row)
  }
}
defineExpose({ show })
</script>

<template>
  <Dialog v-model="open" :title="title" width="400">
    <Form :rules="rules" :schema="schema" @register="formRegister" />
    <template #footer>
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
    </template>
  </Dialog>
</template>
