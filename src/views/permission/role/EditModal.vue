<template>
  <Dialog v-model="open" :title="title" width="400">
    <Form :rules="rules" :schema="schema" @register="formRegister" />
    <template #footer>
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { listRoleApi, updateRoleApi } from '@/api/permission/role'
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import type { FormSchema } from '@/components/Form'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
const emits = defineEmits(['submit'])
const { required, lengthRange } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods

const open = ref(false)
const loading = ref(false)
const title = ref('')
const rules = ref<any>({
  name: [required(), lengthRange({ min: 2, max: 20 })],
  key: [required(), lengthRange({ min: 2, max: 20 })]
})
const schema = ref<FormSchema[]>([
  {
    field: 'pid',
    label: '上级角色',
    component: 'TreeSelect',
    componentProps: {
      defaultExpandAll: true,
      checkStrictly: true
    },
    optionApi: async () => {
      const { data } = await listRoleApi({ pageSize: 100 })
      return data.list
    }
  },
  { field: 'name', label: '角色名称', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'key', label: '角色编码', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'sort', label: '角色顺序', value: 0, component: 'InputNumber', componentProps: { min: 0, max: 1000, controlsPosition: 'right' } },
  { field: 'status', label: '角色状态', value: 1, component: 'RadioButton', componentProps: { options: sys_normal_disable } },
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
    await updateRoleApi(formData)
    proxy.$modal.msgSuccess(`${unref(title)}成功`)
    emits('submit')
    open.value = false
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
