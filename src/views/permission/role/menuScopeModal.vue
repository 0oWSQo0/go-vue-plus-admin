<template>
  <el-dialog v-model="open" title="菜单权限设置" width="450px" append-to-body draggable>
    <el-input v-model="filterText" placeholder="请输入关键字" maxlength="20" />
    <div class="max-h-96 overflow-y-scroll mt-4" v-loading="loading">
      <el-tree ref="treeRef" :data="treeList" default-expand-all :filter-node-method="filterMethod" show-checkbox node-key="id" :default-checked-keys="selectedNode" />
    </div>
    <template #footer>
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { listMenuApi } from '@/api/permission/menu'
import { listPermiApi, updatePermiApi } from '@/api/permission/role'

const { proxy } = getCurrentInstance() as any
const emit = defineEmits(['submit'])
const currentItem = ref<any>({})

const open = ref(false)
const filterText = ref('')
const treeList = ref<any[]>([])
const selectedNode = ref<number[]>([])
const loading = ref(false)
const treeRef = ref()

watch(filterText, (val) => {
  treeRef.value.filter(val)
})
const filterMethod = (value: any, data: any) => {
  if (!value) return true
  return data.label.includes(value)
}

const getMenuList = async () => {
  loading.value = true
  const { data } = await listMenuApi()
  treeList.value = data.list
  loading.value = false
}
const getPermissionList = async (id: number) => {
  const { data } = await listPermiApi({ id })
  selectedNode.value = data.menuIds
}

const reset = () => {
  treeList.value = []
  selectedNode.value = []
  filterText.value = ''
}
const cancel = () => {
  reset()
  open.value = false
}
const submit = async () => {
  await updatePermiApi({ id: currentItem.value.id, menuIds: treeRef.value.getCheckedKeys() })
  proxy.$modal.msgSuccess('操作成功')
  open.value = false
}

const show = (row: any) => {
  currentItem.value = row
  reset()
  getMenuList()
  getPermissionList(row.id)
  open.value = true
}

defineExpose({ show })
</script>
