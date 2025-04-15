<script setup lang="ts">
import { listCertApi, delCertApi } from '@/api/system/cert'
import { useSearch } from '@/hooks/useSearch'
import type { FormSchema } from '@/components/Form'

const { proxy } = getCurrentInstance() as any

const certTypeList = [
  { label: '加密证书', value: 0, elTagType: '' },
  { label: '签名证书', value: 1, elTagType: '' }
]
const { searchRegister, searchMethods } = useSearch()
const { getFormData } = searchMethods
const searchSchema = reactive<FormSchema[]>([
  { label: '证书名称', field: 'title', component: 'Input', componentProps: { maxlength: 20 } },
  { label: '证书类型', field: 'type', component: 'Select', componentProps: { options: certTypeList } }
])
/**
 * 列表
 */
const list = ref<any[]>([])
const loading = ref(false)
const showSearch = ref(true)
const ids = ref<number[]>([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const queryParams = ref<any>({ pageSize: 10, pageNum: 1 })
const getList = async () => {
  loading.value = true
  const params = await getFormData()
  const res: any = await listCertApi({ ...params, ...unref(queryParams) })
  list.value = res.rows
  total.value = res.total
  loading.value = false
}
const handleQuery = async () => {
  queryParams.value.pageNum = 1
  getList()
}
const resetQuery = () => {
  queryParams.value = { pageSize: 10, pageNum: 1 }
  getList()
}
const handleSelectionChange = (selection: any[]) => {
  ids.value = selection.map((item) => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/**
 * 删除
 * @param row
 */
const handleDelete = async (row: any) => {
  await proxy.$modal.confirm('是否确认删除数据项？')
  await delCertApi({ ids: row.id ? [row.id] : ids.value })
  proxy.$modal.msgSuccess('删除成功')
  getList()
}

const handleDownload = async (row: any) => {
  await proxy.$modal.confirm('确定要导出该证书吗？')
  proxy.$download.downloadGet({ url: `/secure/cert/download`, params: { id: row.id }, fileName: `${row.title}.cert` })
  proxy.$modal.msgSuccess('导出成功')
}
getList()
</script>

<template>
  <content-wrap>
    <Search :schema="searchSchema" :search-loading="loading" :resetLoading="loading" v-show="showSearch" @search="handleQuery" @register="searchRegister" @reset="resetQuery" />

    <div class="mb-2 flex justify-between">
      <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      <RightToolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </div>

    <el-table border show-overflow-tooltip v-loading="loading" :data="list" @selectionChange="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column align="center" label="证书名称" prop="title" min-width="100" />
      <el-table-column align="center" label="证书类型" prop="type" min-width="120">
        <template #default="{ row }">
          <dict-tag :options="certTypeList" :value="[row.type]" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述信息" prop="mark" min-width="120" />
      <el-table-column align="center" label="有效期" prop="remark" min-width="220" :formatter="(row) => row.startTime + ' 至 ' + row.endTime" />
      <el-table-column align="center" label="创建时间" prop="createTime" min-width="170" />
      <el-table-column align="center" label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button link type="success" icon="Edit" @click="handleDownload(row)">导出</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
  </content-wrap>
</template>
