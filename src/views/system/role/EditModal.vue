<script setup lang="tsx">
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import { FormSchema } from '@/components/Form'
import { roleMenuTreeselect, treeselect as menuTreeselect } from '@/api/system/menu'
import { addRole, updateRole, getRole } from '@/api/system/role'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
const emits = defineEmits(['submit'])
const { required } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods

const open = ref(false)
const loading = ref(false)
const title = ref('')
const rules = ref<any>({
  roleName: [required()],
  roleKey: [required()],
  roleSort: [required()]
})
const schema = ref<FormSchema[]>([
  { field: 'roleName', label: '角色名称', component: 'Input', componentProps: { maxlength: 20 } },
  {
    field: 'roleKey',
    label: '权限字符',
    component: 'Input',
    componentProps: {
      maxlength: 20,
      slot: {
        label: () => {
          return (
            <>
              <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
                <el-icon>
                  <question-filled />
                </el-icon>
              </el-tooltip>
              权限字符
            </>
          )
        }
      }
    }
  },
  { field: 'roleSort', label: '角色顺序', component: 'InputNumber', componentProps: { maxlength: 20, controlsPosition: 'right', min: 0 } },
  { field: 'status', label: '角色状态', component: 'RadioButton', componentProps: { options: sys_normal_disable } },
  {
    field: 'menuIds',
    label: '菜单权限',
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
const getMenuTreeselect = async () => {
  const res: any = await menuTreeselect()
  treeOptions.value = res.data
}

const treeRef = ref()
function handleCheckedTreeExpand(value: any) {
  const treeList = unref(treeOptions)
  for (let i = 0; i < treeList.length; i++) {
    treeRef.value.store.nodesMap[treeList[i].id].expanded = value
  }
  //   } else if (type === 'dept') {
  //     const treeList = deptOptions.value
  //     for (let i = 0; i < treeList.length; i++) {
  //       deptRef.value.store.nodesMap[treeList[i].id].expanded = value
  //     }
  //   }
}
function handleCheckedTreeNodeAll(value: any) {
  treeRef.value.setCheckedNodes(value ? unref(treeOptions) : [])
  //   } else if (type === 'dept') {
  //     deptRef.value.setCheckedNodes(value ? deptOptions.value : [])
  //   }
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
  if (treeRef.value) {
    treeRef.value.setCheckedKeys([])
  }
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
    formData.roleId ? await updateRole(formData) : await addRole(formData)
    proxy.$modal.msgSuccess(`${unref(title)}成功`)
    open.value = false
    emits('submit')
  } finally {
    loading.value = false
  }
}
const init = async (roleId?: any) => {
  if (roleId) {
    const response: any = await getRole(roleId)
    setValues({ ...response.data, roleSort: Number(response.data.roleSort) })
    const res: any = await roleMenuTreeselect(roleId)
    treeOptions.value = res.menus
    const checkedKeys = res.checkedKeys
    checkedKeys.forEach((v: any) => {
      nextTick(() => {
        treeRef.value.setChecked(v, true, false)
      })
    })
  } else {
    getMenuTreeselect()
  }
}
const show = async (row?: any, ids?: any) => {
  title.value = row ? '修改' : '新增'
  open.value = true
  reset()
  init(row?.roleId || ids)
}
defineExpose({ show })
</script>

<template>
  <Dialog v-model="open" :title="title" width="450" max-height="600px">
    <Form :rules="rules" :schema="schema" @register="formRegister" />
    <template #footer>
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
    </template>
  </Dialog>
</template>
