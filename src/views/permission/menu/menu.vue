<template>
  <ContentWrap>
    <div class="mb-4 flex justify-between">
      <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      <el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
      <right-toolbar :search="false" @queryTable="getList" />
    </div>

    <Table
      v-if="showTable"
      v-model:pageSize="pageSize"
      :default-expand-all="isExpandAll"
      v-model:currentPage="currentPage"
      row-key="id"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
    />

    <EditModal ref="editRef" @submit="getList" />
  </ContentWrap>
</template>

<script setup name="Menu" lang="tsx">
import { delMenuApi, listMenuApi } from '@/api/permission/menu'
import EditModal from './EditModal.vue'
import type { TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/useTable'
import { Icon } from '@/components/Icon'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

/**
 * 列表
 */
const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const res: any = await listMenuApi()
    return { list: res.data.list, total: res.data.totalCount }
  }
})
const { loading, dataList, currentPage, pageSize } = tableState
const { getList } = tableMethods
const columns: TableColumn[] = [
  { field: 'label', label: '菜单名称', align: 'left' },
  {
    field: 'icon',
    label: '菜单图标',
    width: 100,
    slots: {
      default: ({ row }) => {
        return <Icon icon={row.icon} />
      }
    }
  },
  { field: 'sort', label: '显示排序', width: 100 },
  { field: 'name', label: '路由别名' },
  { field: 'path', label: '路由地址' },
  {
    field: 'status',
    label: '菜单状态',
    width: 100,
    slots: {
      default: ({ row }) => {
        return <dict-tag options={unref(sys_normal_disable)} value={[row.status]} />
      }
    }
  },
  {
    field: 'action',
    label: '操作',
    width: 200,
    slots: {
      default: ({ row }) => {
        return (
          <>
            <el-button link type="primary" icon="Plus" onClick={() => handleAdd(row)}>
              新增
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
const handleAdd = (row?: any) => {
  console.log(row.id)
  editRef.value.show(row.id ? { pid: row.id, type: 2 } : {})
}
const handleUpdate = async (row: any) => {
  editRef.value.show(unref(row))
}

/**
 * 删除
 */
const handleDelete = async (row: any) => {
  await proxy.$modal.confirm('是否确认删除名称为"' + row.label + '"的菜单?')
  await delMenuApi(row)
  proxy.$modal.msgSuccess('删除成功')
  getList()
}

const showTable = ref(true)
const isExpandAll = ref(false)
const toggleExpandAll = async () => {
  showTable.value = false
  isExpandAll.value = !unref(isExpandAll)
  await nextTick()
  showTable.value = true
}
</script>
