<template>
  <content-wrap>
    <el-form class="queryForm" v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" clearable maxlength="30" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input v-model="queryParams.roleKey" placeholder="请输入权限字符" clearable maxlength="30" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="角色状态" clearable>
          <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" style="width: 300px">
        <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="mb-2 flex justify-between">
      <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
      <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </div>

    <!-- 表格数据 -->
    <el-table border show-overflow-tooltip v-loading="loading" :data="list" @selectionChange="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="角色名称" prop="roleName" min-width="150" />
      <el-table-column align="center" label="权限字符" prop="roleKey" min-width="150" />
      <el-table-column align="center" label="显示顺序" prop="roleSort" min-width="100" />
      <el-table-column align="center" label="状态" min-width="100">
        <template #default="{ row }">
          <el-switch v-model="row.status" active-value="0" inactive-value="1" @change="handleStatusChange(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" min-width="170" />
      <el-table-column align="center" label="操作" min-width="230">
        <template #default="{ row }">
          <template v-if="row.roleId !== 1">
            <el-button link type="primary" icon="CircleCheck" @click="handleDataScope(row)">数据权限</el-button>
            <el-button link type="success" icon="Edit" @click="handleUpdate(row)">修改</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />

    <DataScopeModal ref="dataScopeRef" />
    <EditModal ref="editRef" @submit="getList" />
  </content-wrap>
</template>

<script setup name="Role" lang="ts">
import { changeRoleStatus, delRole, listRole } from '@/api/system/role'
import DataScopeModal from './DataScopeModal.vue'
import EditModal from './EditModal.vue'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

const list = ref<any[]>([])
const loading = ref(true)
const showSearch = ref(true)
const ids = ref<number[]>([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const dateRange = ref<any>([])
const queryParams = ref<any>({})

const getList = async () => {
  loading.value = true
  const res: any = await listRole(proxy.addDateRange(queryParams.value, dateRange.value))
  list.value = res.rows
  total.value = res.total
  loading.value = false
}
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}
const resetQuery = () => {
  dateRange.value = []
  queryParams.value = {}
  proxy?.resetForm('queryRef')
  handleQuery()
}
const handleSelectionChange = (selection: any[]) => {
  ids.value = selection.map((item) => item.roleId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/**
 * 新增修改
 */
const editRef = ref()
const handleAdd = async () => {
  editRef.value.show()
}
const handleUpdate = async (row: any) => {
  editRef.value.show(unref(row), unref(ids))
}

/** 分配数据权限操作 */
const dataScopeRef = ref()
const handleDataScope = async (row: any) => {
  dataScopeRef.value.show(unref(row))
}

/** 角色状态修改 */
const handleStatusChange = async (row: any) => {
  const text = row.status === '0' ? '启用' : '停用'
  try {
    await proxy.$modal.confirm('确认要"' + text + '""' + row.roleName + '"角色吗?')
    await changeRoleStatus({ roleId: row.roleId, status: row.status })
    proxy.$modal.msgSuccess(text + '成功')
  } catch (e) {
    row.status = row.status === '0' ? '1' : '0'
  }
}

/**
 * 删除
 */
const handleDelete = async (row: any) => {
  await proxy.$modal.confirm('是否确认删除角色数据项?')
  await delRole(row.roleId || unref(ids.value))
  proxy.$modal.msgSuccess('删除成功')
  getList()
}

getList()
</script>
