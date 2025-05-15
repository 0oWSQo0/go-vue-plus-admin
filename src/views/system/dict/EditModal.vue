<script setup lang="ts">
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import { FormSchema } from '@/components/Form'
import { updateTypeApi } from '@/api/system/dict/type'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
const emits = defineEmits(['submit'])
const { required } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods

const open = ref(false)
const loading = ref(false)
const title = ref('')
const rules = ref<any>({
  name: [required()],
  type: [required()]
})
const schema = ref<FormSchema[]>([
  { field: 'name', label: '字典名称', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'type', label: '字典类型', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'status', label: '字典状态', value: 1, component: 'RadioButton', componentProps: { options: sys_normal_disable } },
  { field: 'sort', label: '显示排序', value: 0, component: 'InputNumber', componentProps: { min: 0, max: 1000, controlsPosition: 'right' } },
  { field: 'remark', label: '备注信息', component: 'Input', componentProps: { maxlength: 100, type: 'textarea', showWordLimit: true, autosize: { minRows: 2 } } }
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
    await updateTypeApi(formData)
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
  await reset()
  if (row) {
    await setValues(row)
  } else {
    await setValues({ pid: 0 })
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
