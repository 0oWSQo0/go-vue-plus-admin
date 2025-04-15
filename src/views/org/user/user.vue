<script setup name="User" lang="tsx">
import { changeStatusApi, listUserApi, delUserApi, unbindKeyApi } from '@/api/org/user'
import EditModal from './EditModal.vue'
import BindKeyModal from './BindKeyModal.vue'
import ResetPinModal from './ResetPinModal.vue'
import ResetPwdModal from './ResetPwdModal.vue'
// import { sm3 } from 'sm-crypto'
import { useSearch } from '@/hooks/useSearch'
import type { TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/useTable'
import { useUserStore } from '@/store/modules/user'
import { LoginTypeEnum } from '@/views/Login/types'
import { useIcon } from '@/hooks/useIcon'
import type { FormSchema } from '@/components/Form'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
const userStore = useUserStore()
const loginType = userStore.getLoginType
const keyIcon = useIcon({ icon: 'ant-design:usb-outlined' })
/**
 * 搜索
 */
const showSearch = ref(true)
const { searchRegister, searchMethods } = useSearch()
const { getFormData } = searchMethods
const searchSchema = reactive<FormSchema[]>([
  { label: '用户账号', field: 'username', component: 'Input', componentProps: { maxlength: 20 } },
  { label: '用户昵称', field: 'realName', component: 'Input', componentProps: { maxlength: 20 } },
  { label: '账号状态', field: 'status', component: 'Select', componentProps: { options: sys_normal_disable } },
  { label: '创建时间', field: 'created_at', component: 'DatePicker', componentProps: { type: 'datetimerange', valueFormat: 'x', style: { width: '300px' } } }
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
const ids = ref<any>([])
const single = ref(false)
const multiple = ref(true)
const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const params = await getFormData()
    const res: any = await listUserApi({ ...params, ...{ page: unref(currentPage), pageSize: unref(pageSize), roleId: -1 } })
    return { list: res.data.list, total: res.data.totalCount }
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList } = tableMethods
const columns: TableColumn[] = [
  { field: 'selection', type: 'selection' },
  { field: 'username', label: '用户账号' },
  { field: 'realName', label: '用户昵称' },
  { field: 'roleName', label: '用户角色' },
  { field: 'keyCode', label: 'KEY编码' },
  {
    field: 'status',
    label: '账号状态',
    slots: {
      default: ({ row }) => {
        return <el-switch v-model={row.status} active-value={1} inactive-value={2} active-text="正常" inline-prompt inactive-text="停用" onChange={() => handleChangeStatus(row)} />
      }
    }
  },
  { field: 'createdAt', label: '创建时间', width: 180 },
  {
    field: 'action',
    label: '操作',
    width: 340,
    slots: {
      default: ({ row }) => {
        return (
          <>
            <el-button link type="primary" icon={keyIcon} onClick={() => handleBindKey(row)}>
              <i-carbon-usb />
              {row.keyCode ? '解绑UKEY' : '绑定UKEY'}
            </el-button>
            {loginType === LoginTypeEnum.Default ? (
              <el-button link type="primary" icon="Key" onClick={() => handleResetPwd(row)}>
                重置口令
              </el-button>
            ) : (
              <el-button link v-else type="primary" icon="Key" onClick={() => handleResetPin(row)}>
                重置PIN码
              </el-button>
            )}
            <el-button link type="primary" icon="Edit" onClick={() => handleUpdate(row)}>
              修改
            </el-button>
            <el-button link type="primary" icon="Delete" onClick={() => handleDelete(row)}>
              删除
            </el-button>
          </>
        )
      }
    }
  }
]
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
  await delUserApi(row)
  proxy.$modal.msgSuccess('删除成功')
  getList()
}
const handleDeleteMultiple = async () => {
  await proxy.$modal.confirm('是否确认删除数据项？')
  await delUserApi({ id: unref(ids) })
  proxy.$modal.msgSuccess('删除成功')
  getList()
}
/**
 * 用户状态修改
 */
const handleChangeStatus: any = async (row: any) => {
  const text = row.status === 1 ? '启用' : '停用'
  try {
    await proxy.$modal.confirm('确认要"' + text + '""' + row.username + '"用户吗?')
    await changeStatusApi({ id: row.id, status: row.status })
    proxy.$modal.msgSuccess(text + '成功')
    getList()
  } catch (e: any) {
    row.status = row.status === 1 ? 2 : 1
  }
}

/**
 * 重置
 */
const resetPwdRef = ref()
async function handleResetPwd(row: any) {
  resetPwdRef.value.show(unref(row))
}
const resetPinRef = ref()
async function handleResetPin(row: any) {
  resetPinRef.value.show(unref(row))
}

/**
 * 绑定UKEY
 */
const bindRef = ref()
const handleBindKey = async (row: any) => {
  if (row.keyCode) {
    await proxy.$modal.confirm('是否确认解绑UKEY？')
    await unbindKeyApi(row.userId)
    proxy.$modal.msgSuccess('解绑成功')
    getList()
  } else {
    bindRef.value.show(unref(row))
  }
}
getList()
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" :search-loading="loading" :resetLoading="loading" v-show="showSearch" @search="handleQuery" @register="searchRegister" @reset="resetQuery" />

    <div class="mt-2 mb-4 flex justify-between">
      <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      <el-button type="primary" plain icon="Delete" :disabled="multiple" @click="handleDeleteMultiple">删除</el-button>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </div>
    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      :columns="columns"
      :data="dataList"
      @selectionChange="handleSelectionChange"
      :loading="loading"
      :pagination="{ total }"
      @register="tableRegister"
    />

    <EditModal ref="editRef" @submit="getList" />
    <ResetPinModal ref="resetPinRef" />
    <ResetPwdModal ref="resetPwdRef" />
    <BindKeyModal ref="bindRef" @submit="getList" />
  </ContentWrap>
</template>
