<script setup lang="ts">
import EditModal from './EditModal.vue'
import { changeUserStatus, listUser, delUser } from '@/api/system/user'
import { useSearch } from '@/hooks/useSearch'
import ResetPinModal from './ResetPinModal.vue'
import ResetPwdModal from './ResetPwdModal.vue'
//   import useAppStore from '@/store/modules/app'
// import { CheckKeyStatus, GetKeyInfo } from '@/utils/BHA'

const needKey = ref(false)
const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

const { searchRegister, searchMethods } = useSearch()
const { getFormData } = searchMethods
const searchSchema = reactive([
  // { label: '用户昵称', field: 'nickName', component: 'Input', componentProps: { maxlength: 20 } },
  { label: '用户账号', field: 'userName', component: 'Input', componentProps: { maxlength: 20 } },
  { label: '账号状态', field: 'status', component: 'Select', componentProps: { options: sys_normal_disable } },
  { label: '创建时间', field: 'dateRange', component: 'DatePicker', componentProps: { type: 'daterange', valueFormat: 'YYYY-MM-DD', style: { width: '300px' } } }
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
  const res: any = await listUser(proxy.addDateRange({ ...params, ...unref(queryParams) }, params.dateRange))
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
  ids.value = selection.map((item) => item.userId)
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
  editRef.value.show(row.userId || ids.value[0])
}

/**
 * 删除
 * @param row
 */
const handleDelete = async (row: any) => {
  await proxy.$modal.confirm('是否确认删除数据项？')
  await delUser(row.userId || ids.value)
  proxy.$modal.msgSuccess('删除成功')
  getList()
}

/** 
 * 用户状态修改  
 */
const handleStatusChange = async (row: any) => {
  const text = row.status === '0' ? '启用' : '停用'
  try {
    await proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?')
    await changeUserStatus({ userId: row.userId, status: row.status })
    proxy.$modal.msgSuccess(text + '成功')
  } catch (e: any) {
    row.status = row.status === '0' ? '1' : '0'
  }
}

/**
 * 重置
 */
const resetPwdRef = ref()
async function handleResetPwd(row: any) {
  resetPwdRef.value.show(row)
}
const resetPinRef = ref()
async function handleResetPin(row: any) {
  // const { serialnumber } = await GetKeyInfo(needKey ? 1 : 0)
  // if (serialnumber != row.keyCode) {
  //   proxy.$modal.msgError('非当前用户UKEY')
  //   return
  // }
  resetPinRef.value.show(row)
}

getList()
</script>

<template>
  <content-wrap>
    <Search :schema="searchSchema" :search-loading="loading" :resetLoading="loading" v-show="showSearch" @search="handleQuery" @register="searchRegister" @reset="resetQuery" />

    <div class="mb-2 flex justify-between">
      <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
      <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </div>

    <el-table border show-overflow-tooltip v-loading="loading" :data="list" @selectionChange="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column align="center" label="用户昵称" prop="nickName" />
      <el-table-column align="center" label="用户账号" prop="userName" />
      <el-table-column align="center" label="用户角色" prop="roleName" />
      <el-table-column align="center" label="KEY编码" prop="keyCode" />
      <el-table-column align="center" label="账号状态">
        <template #default="{ row }">
          <el-switch v-model="row.status" active-value="0" inactive-value="1" @change="handleStatusChange(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="170" />
      <el-table-column align="center" label="操作" width="220">
        <template #default="{ row }">
          <template v-if="row.userId !== 1">
            <el-button link v-if="!needKey" type="primary" icon="Key" @click="handleResetPwd(row)">重置口令</el-button>
            <el-button link v-if="needKey" type="primary" icon="Key" @click="handleResetPin(row)">重置PIN码</el-button>
            <el-button link type="success" icon="Edit" @click="handleUpdate(row)">修改</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />

    <!-- 添加或修改用户配置对话框 -->
    <EditModal ref="editRef" @submit="getList" />

    <ResetPinModal ref="resetPinRef" />
    <ResetPwdModal ref="resetPwdRef" />
  </content-wrap>
</template>
