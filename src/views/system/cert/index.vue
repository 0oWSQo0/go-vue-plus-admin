<script setup lang="tsx">
import { listCertApi, delCertApi } from '@/api/system/cert'
import { useSearch } from '@/hooks/useSearch'
import type { FormSchema } from '@/components/Form'
import { useTable } from '@/hooks/useTable'
import { TableColumn } from '@/components/Table/src/types'

const { proxy } = getCurrentInstance() as any

const certTypeList = [
  { label: '加密证书', value: 2, elTagType: '' },
  { label: '签名证书', value: 1, elTagType: '' }
]

/**
 * 搜索
 */
const showSearch = ref(true)
const { searchRegister, searchMethods } = useSearch()
const { getFormData } = searchMethods
const searchSchema = reactive<FormSchema[]>([
  { label: '证书名称', field: 'title', component: 'Input', componentProps: { maxlength: 20 } },
  { label: '证书类型', field: 'type', component: 'Select', componentProps: { options: certTypeList } }
])
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
    const res: any = await listCertApi({ ...params, page: unref(currentPage), pageSize: unref(pageSize) })
    return { list: res.data.list, total: res.data.total }
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList } = tableMethods
const columns: TableColumn[] = [
  { field: 'title', label: '证书名称' },
  { field: 'type', label: '证书类型', formatter: (row: any) => proxy.selectDictLabel(certTypeList, row.type) },
  { field: 'mark', label: '描述信息' },
  { field: 'validity', label: '有效期', minWidth: 230, formatter: (row: any) => row.startTime + ' 至 ' + row.endTime },
  { field: 'createTime', label: '创建时间' },
  {
    field: 'action',
    label: '操作',
    width: 140,
    fixed: 'right',
    slots: {
      default: ({ row }) => {
        return (
          <>
            <el-button link type="primary" plain icon="Download" onClick={() => handleDownload(row)}>
              下载
            </el-button>
            <el-button link type="primary" plain icon="Delete" onClick={() => handleDelete(row)}>
              删除
            </el-button>
          </>
        )
      }
    }
  }
]

/**
 * 删除
 * @param row
 */
const handleDelete = async (row: any) => {
  await proxy.$modal.confirm('是否确认删除数据项？')
  await delCertApi(row.id)
  proxy.$modal.msgSuccess('删除成功')
  getList()
}

const handleDownload = async (row: any) => {
  await proxy.$modal.confirm('确定要导出该证书吗？')
  proxy.$modal.msg('导出中...')
  proxy.$download.downloadGet({ url: `/admin/cert/export/${row.id}` })
}
getList()
</script>

<template>
  <content-wrap>
    <Search :schema="searchSchema" :search-loading="loading" :resetLoading="loading" v-show="showSearch" @search="handleQuery" @register="searchRegister" @reset="resetQuery" />

    <div class="mb-2 flex justify-between">
      <RightToolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </div>
    <Table v-model:pageSize="pageSize" v-model:currentPage="currentPage" :columns="columns" :data="dataList" :loading="loading" :pagination="{ total }" @register="tableRegister" />
  </content-wrap>
</template>
