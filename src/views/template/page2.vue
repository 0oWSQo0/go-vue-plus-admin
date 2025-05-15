<script setup lang="tsx">
import { listLoginLogApi } from '@/api/system/loginLog'
import { useSearch } from '@/hooks/useSearch'
import type { TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/useTable'
import type { FormSchema } from '@/components/Form'

const { proxy } = getCurrentInstance() as any
const { sys_common_status } = proxy.useDict('sys_common_status')

/**
 * 搜索
 */
const showSearch = ref(true)
const { searchRegister, searchMethods } = useSearch()
const { getFormData } = searchMethods
const searchSchema = reactive<FormSchema[]>([{ label: '登录地址', field: 'ipaddr', component: 'Input', componentProps: { maxlength: 20 } }])
const handleQuery = async () => {
  currentPage.value = 1
  getList()
}
const resetQuery = () => {
  pageSize.value = 10
  handleQuery()
}
/**
 * 列表
 */
const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const params = await getFormData()
    const obj = { ...params, ...{ page: unref(currentPage), pageSize: unref(pageSize) } }
    const res: any = await listLoginLogApi(obj)
    return { list: res.rows, total: res.total }
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList } = tableMethods
const columns: TableColumn[] = [
  { field: 'userName', label: '用户账号' },
  {
    field: 'status',
    label: '登录状态',
    slots: {
      default: ({ row }) => {
        return <dict-tag options={unref(sys_common_status)} value={row.status} />
      }
    }
  },
  { field: 'msg', label: '描述信息' },
  { field: 'loginTime', label: '访问时间', width: 180 }
]

/**
 * 导出
 * @param row
 */
const handleDownload = async () => {
  const params = await getFormData()
  proxy.$download.downloadGet({ url: 'monitor/logininfor/export', params })
}
</script>

<template>
  <content-wrap>
    <Search :schema="searchSchema" :search-loading="loading" :resetLoading="loading" v-show="showSearch" @search="handleQuery" @register="searchRegister" @reset="resetQuery" />

    <div class="mb-2 flex justify-between">
      <el-button type="primary" plain icon="Download" @click="handleDownload">导出</el-button>
      <RightToolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </div>

    <Table v-model:pageSize="pageSize" v-model:currentPage="currentPage" :columns="columns" :data="dataList" :loading="loading" :pagination="{ total }" @register="tableRegister" />
  </content-wrap>
</template>
