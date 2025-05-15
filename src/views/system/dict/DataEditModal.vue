<script setup lang="tsx">
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import { FormSchema } from '@/components/Form'
import { updateDataApi } from '@/api/system/dict/data'
import { useDictStore } from '@/store/modules/dict'
import { listTypeApi } from '@/api/system/dict/type'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
const emits = defineEmits(['submit'])
const { required } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods

// 数据标签回显样式
const listClassList = [
  { value: '', label: '无样式' },
  { value: 'primary', label: '蓝色' },
  { value: 'success', label: '绿色' },
  { value: 'info', label: '灰色' },
  { value: 'warning', label: '橙色' },
  { value: 'danger', label: '红色' }
]

const valueTypeList = [
  { value: 'int', label: 'int', name: 'int' },
  { value: 'string', label: 'string', name: 'string' },
  { value: 'int8', label: 'int8', name: 'int8' },
  { value: 'int16', label: 'int16', name: 'int16' },
  { value: 'int32', label: 'int32', name: 'int32' },
  { value: 'int64', label: 'int64', name: 'int64' },
  { value: 'uint', label: 'uint', name: 'uint' },
  { value: 'uint8', label: 'uint8', name: 'uint8' },
  { value: 'uint16', label: 'uint16', name: 'uint16' },
  { value: 'uint32', label: 'uint32', name: 'uint32' },
  { value: 'uint64', label: 'uint64', name: 'uint64' },
  { value: 'float32', label: 'float32', name: 'float32' },
  { value: 'float64', label: 'float64', name: 'float64' },
  { value: 'bool', label: 'bool', name: 'bool' },
  { value: 'date', label: 'date', name: 'date' },
  { value: 'datetime', label: 'datetime', name: 'datetime' },
  { value: '[]string', label: '[]string', name: '[]string' },
  { value: '[]int', label: '[]int', name: '[]int' },
  { value: '[]int64', label: '[]int64', name: '[]int64' }
]

const open = ref(false)
const loading = ref(false)
const title = ref('')
const rules = ref<any>({
  label: [required()],
  value: [required()],
  valueType: [required()]
})
const schema = ref<FormSchema[]>([
  {
    field: 'typeId',
    label: '字典类型',
    component: 'TreeSelect',
    componentProps: {
      defaultExpandAll: true,
      checkStrictly: true,
      props: { value: 'id' }
    },
    optionApi: async () => {
      const { data } = await listTypeApi()
      return data.list
    }
  },
  { field: 'label', label: '数据标签', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'value', label: '数据键值', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'valueType', label: '键值类型', value: 'int', component: 'Select', componentProps: { options: valueTypeList } },
  { field: 'sort', label: '显示排序', value: 0, component: 'InputNumber', componentProps: { maxlength: 6, controlsPosition: 'right', min: 0 } },
  {
    field: 'listClass',
    label: '回显样式',
    component: 'Select',
    componentProps: {
      options: listClassList,
      emptyValues: [undefined, null],
      valueOnClear: null,
      slots: {
        optionDefault: (item: any) => {
          return <>{item.value ? <el-tag type={item.value}>{item.label}</el-tag> : item.label}</>
        }
      }
    }
  },
  { field: 'status', label: '数据状态', value: 1, component: 'RadioButton', componentProps: { options: sys_normal_disable } },
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
    await updateDataApi(formData)
    useDictStore().removeDict(formData.typeId)
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
  await setValues(row)
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
