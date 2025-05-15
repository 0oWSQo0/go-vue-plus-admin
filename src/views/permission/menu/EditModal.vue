<template>
  <!-- 添加或修改菜单对话框 -->
  <Dialog v-model="open" :title="title" width="680">
    <Form :rules="rules" :schema="schema" @register="formRegister" :isCol="true" />
    <template #footer>
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="tsx">
import { updateMenuApi, listMenuApi } from '@/api/permission/menu'
import { useValidator } from '@/hooks/useValidator'
import { useForm } from '@/hooks/useForm'
import type { FormSchema } from '@/components/Form'

const sys_menu_types = [
  { label: '目录', value: 1 },
  { label: '菜单', value: 2 },
  { label: '按钮', value: 3 }
]
const { proxy } = getCurrentInstance() as any
const { sys_menu_component } = proxy.useDict('sys_menu_component')
const emits = defineEmits(['submit'])
const { required } = useValidator()
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData, setSchema, delSchema, addSchema } = formMethods

const open = ref(false)
const loading = ref(false)
const title = ref('')
const rules = ref<any>({
  pid: [required()],
  type: [required()],
  title: [required()],
  path: [required()],
  name: [required()],
  component: [required()]
})
const schema = ref<FormSchema[]>([
  {
    field: 'pid',
    label: '上级菜单',
    component: 'TreeSelect',
    value: 0,
    componentProps: {
      defaultExpandAll: true,
      checkStrictly: true,
      emptyValues: [0],
      valueOnClear: 0,
      props: {
        value: 'id'
      }
    },
    optionApi: async () => {
      const { data } = await listMenuApi()
      return data.list
    }
  },
  {
    field: 'type',
    label: '菜单类型',
    value: 1,
    component: 'RadioButton',
    componentProps: {
      options: sys_menu_types,
      on: {
        change: (val: number) => handleChangeType(val)
      }
    }
  },
  { field: 'title', label: '目录名称', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'icon', label: '菜单图标', component: 'IconPicker' },
  { field: 'path', label: '路由地址', component: 'Input', componentProps: { maxlength: 40 } },
  { field: 'name', label: '路由别名', component: 'Input', componentProps: { maxlength: 20 } },
  { field: 'component', label: '目录组件', value: 'LAYOUT', component: 'Select', componentProps: { options: sys_menu_component } },
  { field: 'redirect', label: '默认跳转', component: 'Input', componentProps: { maxlength: 60 } },
  { field: 'activeMenu', label: '高亮路由', component: 'Input', componentProps: { maxlength: 60 } },
  { field: 'sort', label: '显示排序', value: 0, component: 'InputNumber', componentProps: { min: 0, max: 1000, controlsPosition: 'right' } },
  {
    field: 'isFrame',
    label: '是否外链',
    value: 2,
    component: 'Switch',
    componentProps: {
      activeValue: 1,
      inactiveValue: 2,
      activeText: '是',
      inactiveText: '否',
      inlinePrompt: true,
      on: {
        change: (val: any) => {
          if (val == 1) {
            setSchema([{ field: 'frameSrc', path: 'remove', value: false }])
          } else {
            setSchema([{ field: 'frameSrc', path: 'remove', value: true }])
          }
        }
      }
    }
  },
  { field: 'frameSrc', label: '外链地址', remove: true, component: 'Input', componentProps: { maxlength: 40 } },
  { field: 'status', label: '菜单状态', value: 1, component: 'Switch', componentProps: { activeValue: 1, inactiveValue: 2, activeText: '正常', inactiveText: '停用', inlinePrompt: true } },
  { field: 'keepAlive', label: '缓存路由', value: 0, component: 'Switch', componentProps: { activeValue: 1, inactiveValue: 0, activeText: '缓存', inactiveText: '不缓存', inlinePrompt: true } },
  { field: 'alwaysShow', label: '简化路由', value: 0, component: 'Switch', componentProps: { activeValue: 1, inactiveValue: 0, activeText: '是', inactiveText: '否', inlinePrompt: true } },
  { field: 'isRoot', label: '根路由', value: 0, component: 'Switch', componentProps: { activeValue: 1, inactiveValue: 0, activeText: '是', inactiveText: '否', inlinePrompt: true } },
  { field: 'affix', label: '页签固定', value: 0, component: 'Switch', componentProps: { activeValue: 1, inactiveValue: 0, activeText: '是', inactiveText: '否', inlinePrompt: true } },
  { field: 'hidden', label: '隐藏菜单', value: 0, component: 'Switch', componentProps: { activeValue: 1, inactiveValue: 0, activeText: '是', inactiveText: '否', inlinePrompt: true } },
  {
    field: 'permissions',
    label: '权限标识',
    colProps: { span: 24 },
    formItemProps: {
      slots: {
        default: (formModel: any) => {
          return (
            <>
              {formModel.permissions &&
                formModel.permissions?.split(',')?.map((item: any) => {
                  return (
                    <el-tag class="mr-2 mb-2" size="large" key={item} closable onClose={() => handleClose(item)}>
                      {item}
                    </el-tag>
                  )
                })}
              {unref(inputVisible) ? (
                <el-input style="width: 90px" class="mb-2" v-model={inputValue.value} onKeyup={(e: KeyboardEvent) => handleInput(e)} onBlur={(e: FocusEvent) => handleInput(e)} />
              ) : (
                <el-button icon="Plus" class="mb-2" plain onClick={() => (inputVisible.value = true)}></el-button>
              )}
            </>
          )
        }
      }
    }
  }
])

const handleChangeType = (val: number) => {
  if (val === 1) {
    setSchema([
      { field: 'title', path: 'label', value: '目录名称' },
      { field: 'icon', path: 'remove', value: false },
      { field: 'path', path: 'remove', value: false },
      { field: 'redirect', path: 'remove', value: false },
      { field: 'activeMenu', path: 'remove', value: false },
      { field: 'isFrame', path: 'remove', value: false },
      { field: 'keepAlive', path: 'remove', value: false },
      { field: 'alwaysShow', path: 'remove', value: false },
      { field: 'isRoot', path: 'remove', value: false },
      { field: 'affix', path: 'remove', value: false },
      { field: 'hidden', path: 'remove', value: false }
    ])
    delSchema('component')
    addSchema({ field: 'component', label: '目录组件', component: 'Select', componentProps: { options: sys_menu_component } }, 5)
    setValues({ component: 'LAYOUT' })
  } else if (val === 2) {
    setSchema([
      { field: 'title', path: 'label', value: '菜单名称' },
      { field: 'icon', path: 'remove', value: false },
      { field: 'path', path: 'remove', value: false },
      { field: 'component', path: 'label', value: '组件路径' },
      { field: 'redirect', path: 'remove', value: true },
      { field: 'activeMenu', path: 'remove', value: false },
      { field: 'isFrame', path: 'remove', value: false },
      { field: 'keepAlive', path: 'remove', value: false },
      { field: 'alwaysShow', path: 'remove', value: false },
      { field: 'isRoot', path: 'remove', value: false },
      { field: 'affix', path: 'remove', value: false },
      { field: 'hidden', path: 'remove', value: false }
    ])
    delSchema('component')
    addSchema({ field: 'component', label: '组件路径', component: 'Input', componentProps: { maxlength: 40 } }, 5)
    setValues({ component: '' })
  } else if (val === 3) {
    setSchema([
      { field: 'title', path: 'label', value: '按钮名称' },
      { field: 'icon', path: 'remove', value: true },
      { field: 'path', path: 'remove', value: true },
      { field: 'redirect', path: 'remove', value: true },
      { field: 'activeMenu', path: 'remove', value: true },
      { field: 'isFrame', path: 'remove', value: true },
      { field: 'keepAlive', path: 'remove', value: true },
      { field: 'alwaysShow', path: 'remove', value: true },
      { field: 'isRoot', path: 'remove', value: true },
      { field: 'affix', path: 'remove', value: true },
      { field: 'hidden', path: 'remove', value: true }
    ])
    delSchema('component')
    setValues({ component: '' })
  }
}
/**
 * 处理权限标识
 */
const inputVisible = ref(false)
const inputValue = ref('')
const handleInput = async (e?: any) => {
  if (e?.key === 'Enter' || e.type == 'blur') {
    const formData = await getFormData()
    await setValues({
      permissions: (formData.permissions ? formData.permissions + ',' : '') + unref(inputValue)
    })
    inputVisible.value = false
    inputValue.value = ''
  }
}
const handleClose = async (item: any) => {
  const formData = await getFormData()
  setValues({
    permissions: formData.permissions.replace(item + ',', '')
  })
}

const reset = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}

const submit = async () => {
  const elFormExpose = await getElFormExpose()
  await elFormExpose?.validate()
  try {
    loading.value = true
    const formData = await getFormData()
    await updateMenuApi(formData)
    proxy.$modal.msgSuccess('操作成功')
    open.value = false
    emits('submit')
  } finally {
    loading.value = false
  }
}

const show = async (row?: any) => {
  console.log(row)
  title.value = row.id ? '修改' : '新增'
  open.value = true
  reset()
  handleChangeType(row.type || 1)
  if (row) {
    await nextTick()
    setValues(row)
  }
}

defineExpose({ show })
</script>
