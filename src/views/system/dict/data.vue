<template>
  <content-wrap>
    <el-page-header title="返回" content="字典数据" @back="handleClose" />
    <el-divider />
    <Search :schema="searchSchema" :search-loading="loading" :resetLoading="loading" v-show="showSearch" @search="handleQuery" @register="searchRegister" @reset="resetQuery" />

    <div class="mb-2 flex justify-between">
      <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
      <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </div>

    <el-table border show-overflow-tooltip v-loading="loading" :data="list" @selectionChange="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="字典标签" prop="dictLabel">
        <template #default="{ row }">
          <el-tag :type="row.listClass">{{ row.dictLabel }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="字典键值" prop="dictValue" />
      <el-table-column align="center" label="字典排序" prop="dictSort" />
      <el-table-column align="center" label="字典状态" prop="status">
        <template #default="{ row }">
          <dict-tag :options="sys_normal_disable" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注信息" prop="remark" />
      <el-table-column align="center" label="创建时间" prop="createTime" width="170" />
      <el-table-column align="center" label="操作" :min-width="140">
        <template #default="{ row }">
          <el-button link type="success" icon="Edit" @click="handleUpdate(row)">修改</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
    <DataEditModal ref="editRef" @submit="getList" />
  </content-wrap>
</template>

<script setup name="Data" lang="ts">
import { useDictStore } from '@/store/modules/dict'
import { getDictOptionselect, getType } from '@/api/system/dict/type'
import { listData, getData, delData } from '@/api/system/dict/data'
import { useSearch } from '@/hooks/useSearch'
import DataEditModal from './DataEditModal.vue'
import { useTagsView } from '@/hooks/useTagsView'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
const route = useRoute()

const typeOptions = ref<any[]>([])
const defaultDictType = ref('')
const { searchRegister, searchMethods } = useSearch()
const { getFormData, setValues } = searchMethods
const searchSchema = reactive([
  { label: '字典名称', field: 'dictType', component: 'Select', componentProps: { options: typeOptions, props: { label: 'dictName', key: 'dictId', value: 'dictType' } } },
  { label: '字典标签', field: 'dictLabel', component: 'Input', componentProps: { maxlength: 20 } },
  { label: '字典状态', field: 'status', component: 'Select', componentProps: { options: sys_normal_disable } }
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
const queryParams = ref<any>({})
const getTypes = async (dictId: any) => {
  const res: any = await getType(dictId)
  defaultDictType.value = res.data.dictType
  await setValues({ dictType: res.data.dictType })
  getList()
}
/** 查询字典类型列表 */
const getTypeList = async () => {
  const res = await getDictOptionselect()
  typeOptions.value = res.data
}
/** 查询字典数据列表 */
const getList = async () => {
  loading.value = true
  const params = await getFormData()
  const res: any = await listData({ ...params, ...unref(queryParams) })
  list.value = res.rows
  total.value = res.total
  loading.value = false
}
const handleQuery = async () => {
  queryParams.value.pageNum = 1
  getList()
}
const resetQuery = async () => {
  await setValues({ dictType: unref(defaultDictType) })
  queryParams.value = { pageSize: 10, pageNum: 1 }
  getList()
}
/** 多选框选中数据 */
const handleSelectionChange = (selection: any[]) => {
  ids.value = selection.map((item) => item.dictCode)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/**
 * 新增修改
 */
const editRef = ref()
const handleAdd = () => {
  editRef.value.show(unref(defaultDictType))
}
const handleUpdate = async (row: any) => {
  const res: any = await getData(row.dictCode || ids.value)
  editRef.value.show(unref(defaultDictType), res.data)
}

/** 删除按钮操作 */
const handleDelete = async (row: any) => {
  await proxy.$modal.confirm('是否确认删除字典数据项？')
  await delData(row.dictCode || ids.value)
  getList()
  proxy.$modal.msgSuccess('删除成功')
  useDictStore().removeDict(unref(defaultDictType))
}

/** 返回按钮操作 */
const { push } = useRouter()
const { closeCurrent } = useTagsView()
const handleClose = () => {
  closeCurrent(undefined, () => {
    push({ path: '/system/dict' })
  })
}
getTypes(route.params?.dictId)
getTypeList()
</script>
