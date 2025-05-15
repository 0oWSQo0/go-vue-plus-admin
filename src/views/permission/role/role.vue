<template>
  <ContentWrap>
    <div class="mb-4 flex justify-between">
      <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      <right-toolbar :search="false" @queryTable="getList" />
    </div>
    <Table v-model:pageSize="pageSize" default-expand-all v-model:currentPage="currentPage" row-key="key" :columns="columns" :data="dataList" :loading="loading" @register="tableRegister" />

    <EditModal ref="editRef" @submit="getList" />
    <MenuScopeModal ref="menuRef" />
    <DataScopeModal ref="dataScopeRef" @submit="getList" />
  </ContentWrap>
</template>

<script setup name="Role" lang="tsx">
import { delRoleApi, listRoleApi } from '@/api/permission/role'
import EditModal from './EditModal.vue'
import MenuScopeModal from './menuScopeModal.vue'
import DataScopeModal from './dataScopeModal.vue'
import type { TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/useTable'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

/**
 * 列表
 */
const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const res: any = await listRoleApi({ page: unref(currentPage), pageSize: 100 })
    return { list: res.data.list, total: res.data.totalCount }
  }
})
const { loading, dataList, currentPage, pageSize } = tableState
pageSize.value = 100
const { getList } = tableMethods
const columns: TableColumn[] = [
  { field: 'name', label: '角色名称', align: 'left' },
  { field: 'key', label: '角色编码' },
  {
    field: 'status',
    label: '角色状态',
    width: 100,
    slots: {
      default: ({ row }) => {
        return <dict-tag options={unref(sys_normal_disable)} value={[row.status]} />
      }
    }
  },
  { field: 'createdAt', label: '创建时间', width: 180 },
  { field: 'remark', label: '备注信息' },
  {
    field: 'action',
    label: '操作',
    width: 320,
    slots: {
      default: ({ row }) => {
        return (
          <>
            <el-button link type="primary" icon="CircleCheck" onClick={() => handleMenuScope(row)}>
              菜单权限
            </el-button>
            <el-button link type="primary" icon="CircleCheck" onClick={() => handleDataScope(row)}>
              数据权限
            </el-button>
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

/**
 * 新增修改
 */
const editRef = ref()
const handleAdd = () => {
  editRef.value.show()
}
const handleUpdate = (row: any) => {
  editRef.value.show({ ...row })
}
/**
 * 菜单权限
 */
const menuRef = ref()
const handleMenuScope = (row: any) => {
  menuRef.value.show(row)
}

/**
 * 数据权限
 */
const dataScopeRef = ref()
const handleDataScope = (row: any) => {
  dataScopeRef.value.show({ ...row })
}

/**
 * 删除
 */
const handleDelete = async (row: any) => {
  await proxy.$modal.confirm('是否确认删除角色数据项?')
  await delRoleApi(row)
  proxy.$modal.msgSuccess('删除成功')
  getList()
}
</script>
