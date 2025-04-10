<script setup lang="tsx">
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import { FormSchema } from '@/components/Form'
import { dataScope, getRole, deptTreeSelect } from '@/api/system/role'

const { proxy } = getCurrentInstance() as any
const emits = defineEmits(['submit'])
const { required } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods

const dataScopeOptions = ref([
  { value: '1', label: '全部数据权限' },
  { value: '2', label: '自定数据权限' },
  { value: '3', label: '本部门数据权限' },
  { value: '4', label: '本部门及以下数据权限' },
  { value: '5', label: '仅本人数据权限' }
])

const open = ref(false)
const loading = ref(false)
const rules = ref<any>({
  roleName: [required()],
  roleKey: [required()],
  roleSort: [required()]
})
const schema = ref<FormSchema[]>([
  { field: 'roleName', label: '角色名称', component: 'Input', componentProps: { maxlength: 20, disabled: true } },
  {
    field: 'roleKey',
    label: '权限字符',
    component: 'Input',
    componentProps: { maxlength: 20, disabled: true }
  },
  {
    field: 'roleSort',
    label: '权限范围',
    component: 'Select',
    componentProps: {
      options: dataScopeOptions,
      on: {
        change: (value: any) => {
          if (value !== '2') {
            treeRef.value.setCheckedKeys([])
          }
        }
      }
    }
  },
  {
    field: 'deptIds',
    label: '数据权限',
    component: 'Input',
    formItemProps: {
      slots: {
        default: (formModel: any) => {
          return (
            <>
              <el-checkbox onChange={(value: boolean) => handleCheckedTreeExpand(value)}>展开/折叠</el-checkbox>
              <el-checkbox onChange={(value: boolean) => handleCheckedTreeNodeAll(value)}>全选/全不选</el-checkbox>
              <el-checkbox v-model={formModel.menuCheckStrictly}>父子联动</el-checkbox>
              <el-card shadow="never" class="w-full" body-class="!px-0">
                <el-tree ref={treeRef} data={treeOptions} show-checkbox node-key="id" check-strictly={!formModel.menuCheckStrictly} empty-text="加载中，请稍候..." />
              </el-card>
            </>
          )
        }
      }
    }
  },
  { field: 'remark', label: '备注信息', component: 'Input', componentProps: { maxlength: 100, type: 'textarea', showWordLimit: true, autosize: { minRows: 2 } } }
])

const treeOptions = ref<any>([]) // 菜单树结构

const treeRef = ref()
function handleCheckedTreeExpand(value: any) {
  const treeList = unref(treeOptions)
  for (let i = 0; i < treeList.length; i++) {
    treeRef.value.store.nodesMap[treeList[i].id].expanded = value
  }
}
function handleCheckedTreeNodeAll(value: any) {
  treeRef.value.setCheckedNodes(value ? unref(treeOptions) : [])
}

const getAllCheckedKeys = () => {
  // 目前被选中的菜单节点
  const checkedKeys = treeRef.value.getCheckedKeys()
  // 半选中的菜单节点
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys()
  checkedKeys.unshift()
  checkedKeys.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}

const reset = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
  setValues({
    roleSort: 0,
    status: '0',
    menuIds: [],
    deptIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true
  })
}

const submit = async () => {
  const elFormExpose = await getElFormExpose()
  await elFormExpose?.validate()
  try {
    loading.value = true
    const formData = await getFormData()
    console.log(formData)
    formData.menuIds = getAllCheckedKeys()
    await dataScope(formData)
    proxy.$modal.msgSuccess(`分配成功`)
    open.value = false
    emits('submit')
  } finally {
    loading.value = false
  }
}
const init = async (roleId: number) => {
  const response: any = await getRole(roleId)
  setValues({ ...response.data, roleSort: Number(response.data.roleSort) })
  const res: any = await deptTreeSelect(roleId)
  treeOptions.value = res.depts
  nextTick(() => {
    // if (treeRef.value) {
    treeRef.value.setCheckedKeys(res.checkedKeys)
    // }
  })
}
const show = async (row: any) => {
  open.value = true
  reset()
  init(row.roleId)
}
defineExpose({ show })
</script>

<template>
  <Dialog v-model="open" title="分配数据权限" width="450" max-height="600px">
    <Form :rules="rules" :schema="schema" @register="formRegister" />
    <template #footer>
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
    </template>
  </Dialog>
</template>
