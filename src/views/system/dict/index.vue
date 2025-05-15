<script setup name="Dict" lang="tsx">
import { useDictStore } from '@/store/modules/dict'
import { listTypeApi, delTypeApi } from '@/api/system/dict/type'

import EditModal from './EditModal.vue'
import type { TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/useTable'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

/**
 * 列表
 */
const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const { data }: any = await listTypeApi()
    return { list: data.list }
  }
})
const { loading, dataList } = tableState
const { getList } = tableMethods
const columns: TableColumn[] = [
  { field: 'name', label: '字典名称' },
  {
    field: 'type',
    label: '字典类型',
    slots: {
      default: ({ row }) => {
        return (
          <router-link to={'/system/dict-data/index/' + row.id}>
            <el-link type="primary">{row.type}</el-link>
          </router-link>
        )
      }
    }
  },
  { field: 'sort', label: '显示排序' },
  {
    field: 'status',
    label: '字典状态',
    slots: {
      default: ({ row }) => {
        return <dict-tag options={unref(sys_normal_disable)} value={row.status} />
      }
    }
  },
  { field: 'remark', label: '备注信息', width: 180 },
  {
    field: 'action',
    label: '操作',
    width: 140,
    slots: {
      default: ({ row }) => {
        return (
          <>
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
const handleUpdate = async (row: any) => {
  editRef.value.show(unref(row))
}

/** 删除按钮操作 */
const handleDelete = async (row: any) => {
  await proxy.$modal.confirm('是否确认删除数据项？')
  await delTypeApi({ id: row.id })
  proxy.$modal.msgSuccess('删除成功')
  getList()
}
/** 刷新缓存按钮操作 */
const handleRefreshCache = async () => {
  // await refreshCache()
  proxy.$modal.msgSuccess('刷新成功')
  useDictStore().cleanDict()
}
</script>

<template>
  <content-wrap>
    <div class="mb-2 flex justify-between">
      <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      <el-button type="warning" plain icon="Refresh" @click="handleRefreshCache">刷新缓存</el-button>
      <right-toolbar :search="false" @queryTable="getList" />
    </div>
    <Table :columns="columns" :data="dataList" :loading="loading" @register="tableRegister" />

    <EditModal ref="editRef" @submit="getList" />
  </content-wrap>
</template>
