<template>
  <content-wrap>
    <Search :schema="searchSchema" :search-loading="loading" :resetLoading="loading" v-show="showSearch" @search="handleQuery" @register="searchRegister" @reset="resetQuery" />

    <div class="mb-2 flex justify-between">
      <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
      <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      <el-button type="warning" plain icon="Refresh" @click="handleRefreshCache">刷新缓存</el-button>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </div>

    <el-table border show-overflow-tooltip v-loading="loading" :data="list" @selectionChange="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="字典名称" prop="dictName" />
      <el-table-column align="center" label="字典类型">
        <template #default="{ row }">
          <router-link :to="'/system/dict-data/index/' + row.dictId">
            <el-link type="primary">{{ row.dictType }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="字典状态" prop="status">
        <template #default="{ row }">
          <dict-tag :options="sys_normal_disable" :value="row.status" />
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

<script setup name="Dict" lang="ts">
import { useDictStore } from '@/store/modules/dict'
import { listType, getType, delType, refreshCache } from '@/api/system/dict/type'
import { useSearch } from '@/hooks/useSearch'
import EditModal from './EditModal.vue'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

const { searchRegister, searchMethods } = useSearch()
const { getFormData } = searchMethods
const searchSchema = reactive([
  { label: '字典名称', field: 'configName', component: 'Input', componentProps: { maxlength: 20 } },
  { label: '字典类型', field: 'configKey', component: 'Input', componentProps: { maxlength: 20 } },
  { label: '字典状态', field: 'configType', component: 'Select', componentProps: { options: sys_normal_disable } },
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
  const res: any = await listType({ ...params, ...proxy.addDateRange(queryParams.value, params.dateRange), dateRange: undefined })
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
  ids.value = selection.map((item) => item.dictId)
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
  const res = await getType(row.dictId || ids.value)
  editRef.value.show(res.data)
}

/** 删除按钮操作 */
const handleDelete = async (row: any) => {
  await proxy.$modal.confirm('是否确认删除数据项？')
  await delType(row.dictId || ids.value)
  proxy.$modal.msgSuccess('删除成功')
  getList()
}
/** 刷新缓存按钮操作 */
const handleRefreshCache = async () => {
  await refreshCache()
  proxy.$modal.msgSuccess('刷新成功')
  useDictStore().cleanDict()
}

getList()
</script>
