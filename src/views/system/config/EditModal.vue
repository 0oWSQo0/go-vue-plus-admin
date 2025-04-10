<script setup lang="ts">
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import { FormSchema } from '@/components/Form'
import { addConfig, updateConfig } from '@/api/system/config'

const { proxy } = getCurrentInstance() as any
const { sys_yes_no } = proxy.useDict('sys_yes_no')
const emits = defineEmits(['submit'])
const { required } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods

const open = ref(false)
const loading = ref(false)
const title = ref('')
const rules = ref<any>({
  configName: [required()],
  configKey: [required()],
  configValue: [required()]
})
const schema = ref<FormSchema[]>([
  { field: 'configName', label: '参数名称', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'configKey', label: '参数键名', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'configValue', label: '参数键值', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'configType', label: '系统内置', value: 'Y', component: 'RadioButton', componentProps: { options: sys_yes_no } },
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
    console.log(formData)
    formData.configId ? await updateConfig(formData) : await addConfig(formData)
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
    await setValues(row)
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
