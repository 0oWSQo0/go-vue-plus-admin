<template>
  <el-dialog v-model="open" title="数据权限设置" width="450px" append-to-body draggable>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="数据范围" prop="dataScope">
        <el-select v-model="form.dataScope" placeholder="请选择数据权限">
          <el-option-group v-for="group in dataScopeList" :key="group.key" :label="group.label">
            <el-option v-for="item in group.children" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { listDataScopeApi, updateDataScopeApi } from '@/api/permission/role'

const { proxy } = getCurrentInstance() as any
const emit = defineEmits(['submit'])

const open = ref(false)
const form = ref<any>({})
const formRef = ref()
const rules = ref<any>({})
const dataScopeList = ref<any>([])

const getDataScopeList = async () => {
  const { data }: any = await listDataScopeApi()
  data.list.forEach((item: any) => {
    if (!item.children) {
      item.children = [item]
    }
  })
  dataScopeList.value = data.list
}
const reset = () => {
  form.value = {}
  proxy.resetForm('formRef')
}
const cancel = () => {
  open.value = false
  reset()
}
const submit = async () => {
  await formRef.value.validate()
  await updateDataScopeApi(form.value)
  proxy.$modal.msgSuccess('操作成功')
  emit('submit')
  open.value = false
}

const show = (row: any) => {
  reset()
  getDataScopeList()
  form.value = row || {}
  open.value = true
}

defineExpose({ show })
</script>
