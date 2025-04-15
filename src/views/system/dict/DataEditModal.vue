<script setup lang="tsx">
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import { FormSchema } from '@/components/Form'
import { updateDataApi, listValueTypeApi } from '@/api/system/dict/data'
import { useDictStore } from '@/store/modules/dict'
import { listTypeApi } from '@/api/system/dict/type'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
const emits = defineEmits(['submit'])
const { required } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods

// 数据标签回显样式
const listClassOptions = ref([
  { value: 'default', label: '主题色' },
  { value: 'primary', label: '蓝色' },
  { value: 'success', label: '绿色' },
  { value: 'info', label: '灰色' },
  { value: 'warning', label: '橙色' },
  { value: 'danger', label: '红色' }
])

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
      props: {
        value: 'id'
      }
    },
    optionApi: async () => {
      const { data } = await listTypeApi()
      return data.list
    }
  },
  { field: 'label', label: '数据标签', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'value', label: '数据键值', component: 'Input', componentProps: { maxlength: 20 } },
  {
    field: 'valueType',
    label: '键值类型',
    value: 'string',
    component: 'Select',
    componentProps: {},
    optionApi: async () => {
      const { data } = await listValueTypeApi()
      return data
    }
  },
  { field: 'sort', label: '显示排序', value: 0, component: 'InputNumber', componentProps: { maxlength: 6, controlsPosition: 'right', min: 0 } },
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
  reset()
  await nextTick()
  setValues(row)
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
