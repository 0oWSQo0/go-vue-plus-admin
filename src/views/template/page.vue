<script setup lang="ts">
import { listCardDeptApi, delCardDeptApi } from '@/api/vpn/cardDept'
import { useSearch } from '@/hooks/useSearch'
import EditModal from './EditModal.vue'

const { proxy } = getCurrentInstance() as any

const { searchRegister, searchMethods } = useSearch()
const { getFormData } = searchMethods
const searchSchema = reactive([{ label: '部门名称', field: 'name', component: 'Input', componentProps: { maxlength: 20 } }])
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
  const res: any = await listCardDeptApi({ ...params, ...unref(queryParams) })
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
 * 新增修改
 */
const editRef = ref()
const handleAdd = () => {
  editRef.value.show()
}
const handleUpdate = (row: any) => {
  editRef.value.show(unref(row))
}

/**
 * 删除
 * @param row
 */
const handleDelete = async (row: any) => {
  await proxy.$modal.confirm('是否确认删除数据项？')
  await delCardDeptApi(row.id || unref(ids))
  proxy.$modal.msgSuccess('删除成功')
  getList()
}

getList()
</script>

<template>
  <content-wrap>
    <Search :schema="searchSchema" :search-loading="loading" :resetLoading="loading" v-show="showSearch" @search="handleQuery" @register="searchRegister" @reset="resetQuery" />

    <div class="mb-2 flex justify-between">
      <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      <RightToolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </div>

    <el-table border show-overflow-tooltip v-loading="loading" :data="list" @selectionChange="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column align="center" label="部门名称" prop="name" min-width="100" />
      <el-table-column align="center" label="备注信息" prop="remark" min-width="120" />
      <el-table-column align="center" label="创建时间" prop="createTime" min-width="170" />
      <el-table-column align="center" label="操作" width="140" fixed="right">
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
