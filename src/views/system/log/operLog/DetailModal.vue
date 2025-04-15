<script setup lang="tsx">
import { Regular } from '@/utils/validate'
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import type { DescriptionsSchema } from '@/components/Descriptions'

const { proxy } = getCurrentInstance() as any
const { sys_common_status, sys_oper_type } = proxy.useDict('sys_common_status', 'sys_oper_type')

const currentItem = ref<any>({})
const open = ref(false)
const schema = ref<DescriptionsSchema[]>([
  { class: '!text-center', field: 'moduleName', label: '操作模块' },
  { class: '!text-center', field: 'userName', label: '操作人员' },
  { class: '!text-center', field: 'operDesc', label: '操作描述' },
  { class: '!text-center', field: 'operIp', label: '操作主机' },
  { class: '!text-center', field: 'operParam', label: '请求参数', span: 24 },
  { class: '!text-center', field: 'jsonResult', label: '返回参数', span: 24 },
  { class: '!text-center', field: 'status', label: '操作状态', slots: { default: (data) => <dict-tag options={unref(sys_common_status)} value={data.status} /> } },
  { class: '!text-center', field: 'createTime', label: '操作时间' },
  { class: '!text-center', field: 'errorMsg', label: '异常信息', span: 24 }
])

const reset = async () => {
  currentItem.value = {}
}

const show = async (row: any) => {
  open.value = true
  reset()
  currentItem.value = row
  console.log(row)
}
defineExpose({ show })
</script>

<template>
  <Dialog v-model="open" title="详情" width="600">
    <Descriptions :schema="schema" :data="currentItem" :collapse="false" />
  </Dialog>
</template>
