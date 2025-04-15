<template>
  <content-wrap>
    <Search :schema="searchSchema" :search-loading="loading" :resetLoading="loading" v-show="showSearch" @search="handleQuery" @register="searchRegister" @reset="resetQuery" />

    <div class="mb-2 flex justify-between">
      <el-button plain type="primary" icon="Plus" @click="handleAdd">新增</el-button>
      <el-button plain type="success" icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
      <el-button plain type="danger" icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      <el-button plain type="warning" icon="Refresh" @click="handleRefreshCache">刷新缓存</el-button>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </div>

    <el-table border show-overflow-tooltip v-loading="loading" :data="list" @selectionChange="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column align="center" label="参数名称" prop="configName" width="220" />
      <el-table-column align="center" label="参数键名" prop="configKey" />
      <el-table-column align="center" label="参数键值" prop="configValue" />
      <el-table-column align="center" label="系统内置" prop="configType" width="90">
        <template #default="{ row }">
          <dict-tag :options="sys_yes_no" :value="row.configType" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注信息" prop="remark" />
      <el-table-column align="center" label="创建时间" prop="createTime" width="170" />
      <el-table-column align="center" label="操作" width="140">
        <template #default="{ row }">
          <el-button link type="success" icon="Edit" @click="handleUpdate(row)">修改</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />

    <EditModal ref="editRef" @submit="getList" />
  </content-wrap>
</template>

<script setup name="Config" lang="ts">
import { listConfig, getConfig, delConfig, refreshCache } from '@/api/system/config'
import EditModal from './EditModal.vue'
import { useSearch } from '@/hooks/useSearch'
import type { FormSchema } from '@/components/Form'

const { proxy } = getCurrentInstance() as any
const { sys_yes_no } = proxy.useDict('sys_yes_no')

const { searchRegister, searchMethods } = useSearch()
const { getFormData } = searchMethods
const searchSchema = reactive<FormSchema[]>([
  { label: '参数名称', field: 'configName', component: 'Input', componentProps: { maxlength: 20 } },
  { label: '参数键名', field: 'configKey', component: 'Input', componentProps: { maxlength: 20 } },
  { label: '系统内置', field: 'configType', component: 'Select', componentProps: { options: sys_yes_no } },
  { label: '创建时间', field: 'dateRange', component: 'DatePicker', componentProps: { type: 'daterange', valueFormat: 'YYYY-MM-DD', style: { width: '230px' } } }
])
/**
 * 列表
 */
const list = ref<any[]>([])
const loading = ref(true)
const showSearch = ref(true)
const ids = ref<number[]>([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const queryParams = ref<any>({ pageSize: 10, pageNum: 1 })

const getList = async () => {
  loading.value = true
  const params = await getFormData()
  const res: any = await listConfig({ ...params, ...proxy.addDateRange(queryParams.value, params.dateRange), dateRange: undefined })
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
  ids.value = selection.map((item) => item.configId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/**
 * 新增修改
 */
const editRef = ref()
const handleAdd = () => {
  editRef.value.show()
}
const handleUpdate = async (row: any) => {
  const res: any = await getConfig(row.configId || ids.value)
  editRef.value.show(res.data)
}

/** 删除按钮操作 */
const handleDelete = async (row: any) => {
  await proxy.$modal.confirm('是否确认删除数据项？')
  await delConfig(row.configId || ids.value)
  getList()
  proxy.$modal.msgSuccess('删除成功')
}
/** 刷新缓存按钮操作 */
const handleRefreshCache = async () => {
  await refreshCache()
  proxy.$modal.msgSuccess('刷新缓存成功')
}

getList()
</script>
