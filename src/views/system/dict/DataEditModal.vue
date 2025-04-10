<script setup lang="tsx">
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import { FormSchema } from '@/components/Form'
import { addData, updateData } from '@/api/system/dict/data'
import { useDictStore } from '@/store/modules/dict'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
const emits = defineEmits(['submit'])
const { required } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods

// 数据标签回显样式
const listClassOptions = ref([
  { value: 'default', label: '默认' },
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' }
])

const open = ref(false)
const loading = ref(false)
const title = ref('')
const rules = ref<any>({
  dictLabel: [required()],
  dictValue: [required()],
  dictSort: [required()]
})
const schema = ref<FormSchema[]>([
  { field: 'dictType', label: '字典类型', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'dictLabel', label: '数据标签', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'dictValue', label: '数据键值', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'cssClass', label: '样式属性', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'dictSort', label: '显示排序', value: 0, component: 'InputNumber', componentProps: { maxlength: 6, controlsPosition: 'right', min: 0 } },
  {
    field: 'listClass',
    label: '回显样式',
    value: 'default',
    component: 'Select',
    componentProps: {
      options: listClassOptions,
      slot: {
        label: ({ item }) => {
          return (
            <>
              <span>{item.label + '(' + item.value + ')'}</span>
            </>
          )
        }
      }
    }
  },
  { field: 'status', label: '数据状态', value: '0', component: 'RadioButton', componentProps: { options: sys_normal_disable } },
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
    formData.dictCode ? await updateData(formData) : await addData(formData)
    useDictStore().removeDict(formData.dictType)
    proxy.$modal.msgSuccess(`${unref(title)}成功`)
    open.value = false
    emits('submit')
  } finally {
    loading.value = false
  }
}

const show = async (dictType: string, row: any) => {
  title.value = row ? '修改' : '新增'
  open.value = true
  reset()
  await nextTick()
  setValues({ dictType })
  if (row) {
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
