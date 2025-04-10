<script setup lang="tsx">
import { listOperLogApi } from '@/api/system/operLog'
import { useSearch } from '@/hooks/useSearch'
import type { TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/useTable'
import DetailModal from './DetailModal.vue'

const { proxy } = getCurrentInstance() as any
const { sys_common_status, sys_oper_type } = proxy.useDict('sys_common_status', 'sys_oper_type')

/**
 * 搜索
 */
const showSearch = ref(true)
const { searchRegister, searchMethods } = useSearch()
const { getFormData } = searchMethods
const searchSchema = reactive([
  { label: '系统模块', field: 'moduleName', component: 'Input', componentProps: { maxlength: 20 } },
  { label: '操作人员', field: 'userName', component: 'Input', componentProps: { maxlength: 20 } },
  { label: '操作类型', field: 'operType', component: 'Select', componentProps: { options: sys_oper_type } },
  { label: '操作状态', field: 'status', component: 'Select', componentProps: { options: sys_common_status } },
  { label: '操作时间', field: 'dateRange', component: 'DatePicker', componentProps: { type: 'daterange', valueFormat: 'YYYY-MM-DD', style: { width: '300px' } } }
])
const handleQuery = async () => {
  currentPage.value = 1
  getList()
}
const resetQuery = () => {
  currentPage.value = 1
  pageSize.value = 10
  getList()
}
/**
 * 列表
 */
const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const params = await getFormData()
    const obj = { ...params, ...proxy.addDateRange({ pageNum: unref(currentPage), pageSize: unref(pageSize) }, params.dateRange), dateRange: undefined }
    const res: any = await listOperLogApi(obj)
    return { list: res.rows, total: res.total }
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList } = tableMethods
const columns: TableColumn[] = [
  { field: 'moduleName', label: '系统模块' },
  { field: 'operType', label: '操作类型', slots: { default: ({ row }) => <DictTag options={unref(sys_oper_type)} value={row.operType} /> } },
  { field: 'userName', label: '操作人员' },
  { field: 'operIp', label: '操作主机' },
  {
    field: 'status',
    label: '操作状态',
    slots: {
      default: ({ row }) => <DictTag options={unref(sys_common_status)} value={row.status} />
    }
  },
  { field: 'createTime', label: '操作日期', width: 180 },
  {
    field: 'action',
    label: '操作',
    slots: {
      default: ({ row }) => (
        <el-button link type="primary" icon="View" onClick={() => handleDetail(row)}>
          详情
        </el-button>
      )
    }
  }
]

const detailRef = ref()
const handleDetail = (row: any) => {
  detailRef.value.show(unref(row))
}
/**
 * 导出
 * @param row
 */
const handleDownload = async () => {
  proxy.$download.downloadGet('monitor/logininfor/export', { ...queryParams.value }, `config_${new Date().getTime()}.xlsx`)
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
    <DetailModal ref="detailRef" />
  </content-wrap>
</template>
