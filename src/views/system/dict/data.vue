<template>
  <content-wrap>
    <el-page-header title="返回" content="字典数据" @back="handleClose" />
    <el-divider />
    <Search :schema="searchSchema" :search-loading="loading" :resetLoading="loading" v-show="showSearch" @search="handleQuery" @register="searchRegister" @reset="resetQuery" />

    <div class="mb-2 flex justify-between">
      <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </div>
    <Table :columns="columns" :data="dataList" :loading="loading" @register="tableRegister" />

    <DataEditModal ref="editRef" @submit="getList" />
  </content-wrap>
</template>

<script setup name="Data" lang="tsx">
import { useDictStore } from '@/store/modules/dict'
import { listDataApi, delDataApi } from '@/api/system/dict/data'
import { useSearch } from '@/hooks/useSearch'
import DataEditModal from './DataEditModal.vue'
import { useTagsView } from '@/hooks/useTagsView'
import type { TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/useTable'
import { FormSchema } from '@/components/Form'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
const route = useRoute()

const showSearch = ref(true)
const { searchRegister, searchMethods } = useSearch()
const { getFormData } = searchMethods
const searchSchema = reactive<FormSchema[]>([
  { label: '字典标签', field: 'label', component: 'Input', componentProps: { maxlength: 20 } },
  { label: '字典键值', field: 'value', component: 'Input', componentProps: { maxlength: 20 } }
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
const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const params = await getFormData()
    const obj = { ...params, ...{ page: unref(currentPage), pageSize: unref(pageSize), typeId: route.params.id } }
    const { data }: any = await listDataApi(obj)
    return { list: data.list, total: data.totalCount }
  }
})
const { loading, dataList, currentPage, pageSize } = tableState
const { getList } = tableMethods
const columns: TableColumn[] = [
  { field: 'type', label: '字典类型', minWidth: 180 },
  {
    field: 'label',
    label: '字典标签',
    slots: {
      default: ({ row }) => {
        return <el-tag type={row.listClass}>{row.label}</el-tag>
      }
    }
  },
  { field: 'value', label: '字典键值' },
  { field: 'valueType', label: '键值类型' },
  {
    field: 'status',
    label: '字典状态',
    slots: {
      default: ({ row }) => {
        return <dict-tag options={unref(sys_normal_disable)} value={[row.status]} />
      }
    }
  },
  { field: 'sort', label: '排序' },
  { field: 'remark', label: '备注' },
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
  editRef.value.show({ typeId: +route.params.id })
}
const handleUpdate = async (row: any) => {
  editRef.value.show(unref(row))
}

/** 删除按钮操作 */
const handleDelete = async (row: any) => {
  await proxy.$modal.confirm('是否确认删除字典数据项？')
  await delDataApi(row.typeId)
  getList()
  proxy.$modal.msgSuccess('删除成功')
  useDictStore().removeDict(row.typeId)
}

/** 返回按钮操作 */
const { push } = useRouter()
const { closeCurrent } = useTagsView()
const handleClose = () => {
  closeCurrent(undefined, () => {
    push({ path: '/system/dict' })
  })
}
getList()
</script>
